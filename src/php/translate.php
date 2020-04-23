<?php
  $data = array();
  $errors = array();
  $errorString = "";
  $text = $_GET["text"];
  if (empty($text)) {
   array_push($errors, "Text is empty!");
  } 
  if(_s_has_numbers($text)) {
    array_push($errors, "Numbers in text are not allowed!");
  }
  if( _s_has_special_chars($text)) {
    array_push($errors, "Special characters in text are not allowed!");  
  }
  if(!empty($errors)){
    $data['success'] = false;
    $errorString = 'Could not translate message, invalid string.<ul>';        
    foreach ($errors as &$value) {
      $errorString .= '<li>' . $value . '</li>';   
    }  
    unset($value);    
    $errorString .= '</ul>';
    $data['err'] = $errorString;  
    echo json_encode($data);
    return;    
  }
  $data['success'] = true;
  $data['result'] = mb_strtoupper($text);    
  echo json_encode($data);

  // Does string contain numbers?
  function _s_has_numbers( $string ) {
    return preg_match( '/\d/', $string );
  }

  // Does string contain special characters?
  function _s_has_special_chars( $string ) {
    return preg_match('/[^a-zA-ZöäüßÖÄÜ\s]/', $string);
  }
?>