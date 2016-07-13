<?php
// Version 1.0 06/09/2015
// Undid a fix that just plain broke the rest_proxy.php.  
//
// Version 0.9 03/21/2015
// Fixes for content-length being sent down when original response was gzipped.  Would cause the client problem if the server running the proxy wasn't zipping it as well
// We have disabled gzip upstream until 4/15/2015 at which point everyone should have their proxy scripts upgraded.
// Added a flag that can be set to enable debugging to the error_log instead of having to uncomment all the statements.
// Change SSL certificate verify flag.
// Set an empty Expect header in the request to prevent curl from sending the Expect: 100-Continue header.
// Simplify the HTTP 100 Continue header trimming and allow for multiple of them
// Close out the curl handle sooner.
// Add a proxy version number to the header so we can tell from the server side if people are running out of date proxies
// Version 2.0 06/13/2016
// Replaced http_parse_headers to remove the deprecated /e on the regex within the old function.
// Added conditional check for headers before adding Content-Length and Content-Type manually.
// Added warning if secure.ultracart.com is used.  StoreFront urls should be used now.
// The advantage of using your storefront url is the merchant id may be inferred from the url, so it no longer needs to be
// passed directly.

// Version 0.8 11/27/2013
// The cleaning of the _url variable was removing dashes, underscores and spaces, which are valid in urls.  Fixed.

// Version 0.7.  08/15/2013
// Some of the PUT/POST requests were returning back 100 Continues.  That was wrecking havoc with the parser below causing aborted calls.

// Version 0.6.  06/22/2013
// Headers weren't being handled correctly.  Server http status wasn't being passed along.
// Headers with multiple values weren't iterated correctly and were being mangled (think multiple 'Set-Cookie')

// Version 0.5.  02/07/2013  Initial Version.

$rest_proxy_version = "2.0";

// TODO: Change this to your storefront url.  For example: demo.ultracartstore.com, or your custom SSL server name.
$storefront_url = 'secure.ultracart.com';
if ($storefront_url === 'secure.ultracart.com') {
    error_log('Error. You are making calls directly against secure.ultracart.com.  This is a deprecated feature and may discontinue at any time.  All calls should be made to your storefront url.');
    die('do not make calls directly to secure.ultracart.com.  change your storefront_url variable within your rest_proxy.php script.');
}


// Set this variable to true if you want to troubleshoot output in the PHP error_log location
// The location of this log file is dependant on your php.ini file.  Check the location with the phpinfo function.
$proxyDebug = false;

if ($proxyDebug) {
    error_log("$_SERVER[REQUEST_URI]");
}

if (!function_exists('http_parse_headers')) {
    function http_parse_headers($raw_headers)
    {
        $headers = array();
        $key = '';

        foreach (explode("\n", $raw_headers) as $i => $h) {
            $h = explode(':', $h, 2);

            if (isset($h[1])) {
                if (!isset($headers[$h[0]]))
                    $headers[$h[0]] = trim($h[1]);
                elseif (is_array($headers[$h[0]])) {
                    $headers[$h[0]] = array_merge($headers[$h[0]], array(trim($h[1])));
                } else {
                    $headers[$h[0]] = array_merge(array($headers[$h[0]]), array(trim($h[1])));
                }

                $key = $h[0];
            } else {
                if (substr($h[0], 0, 1) == "\t")
                    $headers[$key] .= "\r\n\t" . trim($h[0]);
                elseif (!$key)
                    $headers[0] = trim($h[0]);
            }
        }

        return $headers;
    }
}

function header_present($header, $header_name)
{
    $header_name = strtoupper($header_name);
    foreach ($header as $incoming_header) {
        if (0 === strpos(strtoupper($incoming_header), $header_name)) {
            return TRUE;
        }
    }
    return FALSE;
}


if (isset($_GET["_url"])) {
    $path = $_GET["_url"]; // get the url parameter
} else {
    die("UltraCart rest proxy script called incorrectly.  _url query parameter is required.");
}


$path = preg_replace('#[^a-z0-9/ \-_]#i', '', $path); // strip off any junk
$path = preg_replace('#/+#', '/', $path); // remove duplicate slashes if any
if (strncmp($path, '/', 1) != 0) { // if the path doesn't start with a slash, add one.
    $path = '/' . $path;
}

// if there are any spaces in the path, replace them with %20
// you might see spaces in the path for item searches if the item id has a space (bad idea all around, but the item editor does allow spaces ... sadly.)
if (strncmp($path, ' ', 1) != 0) {
    $path = str_replace(' ', '%20', $path);
}


// I'm leaving in the _url in the query string being passed to the server.  It won't hurt anything and keeps the code
// more robust.
$query_str = '';
$query_str_start = strpos($_SERVER['REQUEST_URI'], '?', 0);
if ($query_str_start !== FALSE) {
    $query_str = substr($_SERVER['REQUEST_URI'], $query_str_start);
}

// the above filtering should remove any malicious attempts, but no worries, UltraCart has some insane firewalls to boot.
$server_get_url = "https://" . $storefront_url . $path . $query_str;
$post_data = file_get_contents('php://input');

foreach ($_SERVER as $i => $val) {
    if (strpos($i, 'HTTP_') === 0) {
        if ($i == 'HTTP_X_UC_MERCHANT_ID') {
            $header[] = "X-UC-Merchant-Id: $val";
        } else if ($i == 'HTTP_X_UC_SHOPPING_CART_ID') {
            $header[] = "X-UC-Shopping-Cart-Id: $val";
        } else if($i == 'HTTP_HOST'){
            $header[] = "HOST: $storefront_url";
        } else {
            $name = str_replace(array('HTTP_', '_'), array('', '-'), $i);
            $header[] = "$name: $val";
        }
    }
}

if (isset($_SERVER['CONTENT_TYPE'])) {
    $content_type = $_SERVER['CONTENT_TYPE'];
} else {
    $content_type = 'application/json';
}

$header[] = "X-UC-Forwarded-For: " . $_SERVER['REMOTE_ADDR'];
$header[] = "X-UC-Proxy-Version: " . $rest_proxy_version;
// Force curl to send an empty Expect header on the request to prevent it form sending an Expect 100 (StackOverflow FTW)
$header[] = "Expect: ";
if (!header_present($header, 'Content-Type')) {
    $header[] = "Content-Type: " . $content_type;
}
if (!header_present($header, 'Content-Length')) {
    $header[] = "Content-Length: " . strlen($post_data);
}


$ch = curl_init($server_get_url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 100);
curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, TRUE);
curl_setopt($ch, CURLOPT_VERBOSE, 1);
curl_setopt($ch, CURLOPT_HEADER, 1);
curl_setopt($ch, CURLOPT_ENCODING, 1);

if (strlen($post_data) > 0) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
}

$response = curl_exec($ch);

if ($proxyDebug) error_log("start response ===========================================");
if ($proxyDebug) error_log("start raw response =======================================");
if ($proxyDebug) error_log($response);
if ($proxyDebug) error_log("end raw response =========================================");

// Trim off HTTP 100 response headers if they exist
$delimiter = "\r\n\r\n"; // HTTP header delimiter
while (preg_match('#^HTTP/[0-9\\.]+\s+100\s+Continue#i', $response)) {
    $tmp = explode($delimiter, $response, 2); // grab the 100 Continue header
    $response = $tmp[1]; // update the response, purging the most recent 100 Continue header
} // repeat

// now we just have the normal header and the body
$parts = explode($delimiter, $response, 2);
$header = $parts[0];
$body = $parts[1];

// grab the status code and set the proxy request result to that.
$first_line = '';
if (strlen($response) > 0) {
    $first_line = substr($response, 0, strpos($response, "\n") - 1);
    $first_line = trim($first_line);

    if ($proxyDebug) {
        error_log('$first_line:[' . $first_line . ']');
    }
    header($first_line);
}


if (curl_errno($ch)) {
    print curl_error($ch);
    curl_close($ch);
} else {
    // We're through with curl at this point.  Close it out as soon as possible
    curl_close($ch);

    // Send the rest of the headers that we are interested in
    $response_headers = http_parse_headers($header);
    foreach ($response_headers as $header_key => $header_value) {
        if ($header_key != 'Content-Encoding' && $header_key != 'Vary' && $header_key != 'Connection' && $header_key != 'Transfer-Encoding' && $header_key != 'User-Agent') {
            if ($header_key == 'Content-Length' && $header_value == "0") {
                /* ignore this, it's from an HTTP 1.1 100 Continue and will destroy the result if passed along. */
            } else if ($header_key == 'Content-Length') {
                // Skip sending the content length header because the upstream response could have been gzipped
                if ($proxyDebug) {
                    error_log("Skip sending client header - $header_key: $header_value");
                }
            } else {
                if (is_array($header_value)) {
                    foreach ($header_value as $val) {
                        if ($proxyDebug) {
                            error_log("$header_key: $val");
                        }
                        header("$header_key: $val", false);
                    }
                } else {
                    if ($proxyDebug) {
                        error_log("$header_key: $header_value");
                    }
                    header("$header_key: $header_value", false);
                }

            }
        } else {
            if ($proxyDebug) {
                error_log("Skip sending client header - $header_key: $header_value");
            }
        }
    }
    if ($proxyDebug) {
        error_log("Outputting body");
        error_log(strlen($body));
    }

    // Send the body
    echo $body;
}
if ($proxyDebug) {
    error_log("end response =============================================");
}
