<?php

########### CONFIG ###############

$recipient = $_POST["email"];
$message = $_POST["message"];
$username = $_POST["username"];
$subject = "Reset password for " . $username;

########### CONFIG END ###########


switch ($_SERVER['REQUEST_METHOD']) {

    case ("OPTIONS"):
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;


    case ("POST"):
        header("Access-Control-Allow-Origin: *");

        $headers = "From: noreply@mjschuh.com" . "\r\n";
        $headers .= "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

        mail($recipient, $subject, $message, $headers);
        break;

    default:
        header("Allow: POST", true, 405);
        exit;
}