<?php
    // Config
    $_BASE_URL = "http://10.0.0.9/ozzik4/";

    $page = (isset($_GET['page'])) ? $_GET['page'] : false;
    $meta = (isset($_GET['meta'])) ? $_GET['meta'] : false;
    $_page = null;
    $_meta = null;

    // Home
    if (!$page || $meta === "concepts" || $meta === "freebies") {
        $_page = "home";
        $_meta = ($meta) ? $meta : "products";
    } else if ($page === "project") {
        $_page = "project";
        $_meta = $meta;
    }

    include_once("home.php");
?>