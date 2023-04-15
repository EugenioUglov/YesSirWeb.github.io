<?php
require_once 'vendor/autoload.php';
  
define('GOOGLE_CLIENT_ID', '362349719663-tspg2dbu0hpe3n9tdp7619d6a3pd0vf3.apps.googleusercontent.com');
define('GOOGLE_CLIENT_SECRET', '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');
  
$config = [
    'callback' => 'https://eugeniouglovprogrammer.on.drv.tw/yessir',
    'keys'     => [
                    'id' => GOOGLE_CLIENT_ID,
                    'secret' => GOOGLE_CLIENT_SECRET
                ],
    'scope'    => 'https://www.googleapis.com/auth/spreadsheets',
    'authorize_url_parameters' => [
            'approval_prompt' => 'force', // to pass only when you need to acquire a new refresh token.
            'access_type' => 'offline'
    ]
];
  
$adapter = new Hybridauth\Provider\Google( $config );