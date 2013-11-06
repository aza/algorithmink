<?php

// Sanatize input strings
$author = ereg_replace("[^A-Za-z0-9| ]", "", $_POST["author"]);
$title = ereg_replace("[^A-Za-z0-9| ]", "", $_POST["title"]);
$code = ereg_replace("[<>]", "", $_POST["code"]);

if( !$code || !$title || !$author ){
  echo "FAIL";  
  return;
}

if( $title == "undefined" || $authoer == "undefined" ){
  echo "FAIL";  
  return;
}

$salt = "salt some slugs!";

$id = substr(md5( $code . $salt ), 0, 8 );
$imgFileName = "saves/" . $id . ".png";
$infoFileName = "saves/" . $id . ".txt";

$dataurl = str_replace(" ", "+", $_POST["data"]);
$data = substr($dataurl, strpos($dataurl, ","));


if( file_exists($imgFileName) ){
  echo "FAIL";
  return;
}

$file = fopen($imgFileName, "w");
fwrite($file, base64_decode($data));
fclose($file);

$file = fopen($infoFileName, "w");
$out = $author . "&" . $title . "&" . $code;
fwrite($file, $out);
fclose($file);

echo $id;

?>