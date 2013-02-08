<?php
// Version 0.5.  02/07/2013  Initial Version.

  function http_parse_headers( $header ) {
      $retVal = array();
      $fields = explode("\r\n", preg_replace('/\x0D\x0A[\x09\x20]+/', ' ', $header));
      foreach( $fields as $field ) {
          if( preg_match('/([^:]+): (.+)/m', $field, $match) ) {
              $match[1] = preg_replace('/(?<=^|[\x09\x20\x2D])./e', 'strtoupper("\0")', strtolower(trim($match[1])));
              if( isset($retVal[$match[1]]) ) {
                  $retVal[$match[1]] = array($retVal[$match[1]], $match[2]);
              } else {
                  $retVal[$match[1]] = trim($match[2]);
              }
          }
      }
      return $retVal;
  }

  function gzdecode($data){
      $g=tempnam('/tmp','ff');
      @file_put_contents($g,$data);
      ob_start();
      readgzfile($g);
      $d=ob_get_clean();
      unlink($g);
      return $d;
  }

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

$ch = curl_init( $server_get_url );
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 100);
curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($ch, CURLOPT_VERBOSE, 1);
curl_setopt($ch, CURLOPT_HEADER, 1);
curl_setopt($ch, CURLOPT_ENCODING, 1);

if ( strlen($post_data)>0 ){
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
}

$response = curl_exec($ch);

if (curl_errno($ch)) {
    print curl_error($ch);
} else {
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $header = substr($response, 0, $header_size);
    $response_headers = http_parse_headers($header);
    foreach($response_headers as $i=>$val) {
      if($i != 'Content-Encoding' && $i != 'Vary' && $i != 'Connection' && $i != 'Transfer-Encoding'){
        header("$i: $val");
      }
    }
    $body = substr($response, $header_size);
    echo $body;
    curl_close($ch);
}
?>