<?php
// Version 0.5.  02/07/2013  Initial Version.

if(isset($_GET["_url"])){
  $path = $_GET["_url"]; // get the url parameter
} else {
  die("UltraCart rest proxy script called incorrectly.  _url query parameter is required.");
}


$path = preg_replace('#[^a-z0-9/]#i', '', $path); // strip off any junk
$path = preg_replace('#/+#', '/', $path); // remove duplicate slashes if any
if(strncmp($path, '/', 1) != 0){ // if the path doesn't start with a slash, add one.
  $path = '/' . $path;
}

$additional_parameters = '';
foreach( $_GET as $k=>$v ){
  if($k != '_url'){
    if($additional_parameters){
      $additional_parameters = $additional_parameters . '&' . $k . "=" . urlencode($v);
    } else {
      $additional_parameters = $additional_parameters . '?' . $k . "=" . urlencode($v);
    }
  }
}

// the above filtering should remove any malicious attempts, but no worries, UltraCart has some insane firewalls to boot.
$server_get_url = "https://secure.ultracart.com" . $path . $additional_parameters;
$post_data = file_get_contents('php://input');

foreach($_SERVER as $i=>$val) {
// error_log($i);
    if (strpos($i, 'HTTP_') === 0) {
      if($i == 'HTTP_X_UC_MERCHANT_ID'){
        $header[] = "X-UC-Merchant-Id: $val";
      }else if($i == 'HTTP_X_UC_SHOPPING_CART_ID'){
        $header[] = "X-UC-Shopping-Cart-Id: $val";
      } else {
        $name = str_replace(array('HTTP_', '_'), array('', '-'), $i);
        $header[] = "$name: $val";
      }
    }  
}

if(isset($_SERVER['CONTENT_TYPE'])){
  $content_type = $_SERVER['CONTENT_TYPE'];
} else {
  $content_type = 'application/json';
}

$header[] = "Content-Type: ". $content_type;
$header[] = "Content-Length: ". strlen($post_data);
$header[] = "X-UC-Forwarded-For: " . $_SERVER['REMOTE_ADDR'];

// error_log(implode(', ', $header));

$ch = curl_init( $server_get_url );
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 100);
curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

if ( strlen($post_data)>0 ){
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
}

$response = curl_exec($ch);     

if (curl_errno($ch)) {
    print curl_error($ch);
} else {
    curl_close($ch);
    header('Content-type: application/json');
    // error_log($response);
    print $response;
}
?>