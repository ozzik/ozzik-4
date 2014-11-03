<?php
    // Config
    $_BASE_URL = "http://10.0.0.9/ozzik4/";

    $page = (isset($_GET['page'])) ? $_GET['page'] : false;
    $meta = (isset($_GET['meta'])) ? $_GET['meta'] : false;
    $meta2 = (isset($_GET['meta2'])) ? $_GET['meta2'] : false;
    $_page = null;
    $_meta = null;
    $_meta2 = null;

    // Home
    if (!$page || $meta === "concepts" || $meta === "freebies") {
        $_page = "home";
        $_meta = ($meta) ? $meta : "products";
        $_meta = "'$_meta'";
    } else if ($page === "project") {
        $_page = "project";
        $_meta = "{'collection': '$meta2', 'item': '$meta'}";
    }

    include_once("home.php");
?>