<?php 
    $data = array();
    $input = $_GET["input"];
    $output = $_GET["output"];
    $text = sprintf("Input: %s \nOutput: %s", $input, $output);
    $filename = "file\\testfile.txt";
    $dirname = dirname($filename);
    if (!is_dir($dirname)) {
        mkdir($dirname, 0755, true);
    }
    $myfile = fopen($filename, "w");
    fwrite($myfile, $text);  

    header("Content-type: text/plain");
    header('Content-Description: File Download');      
    
    ob_clean();
    flush();
    readfile($filename);
    unlink($filename);
?>