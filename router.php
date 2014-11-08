<?php
    $isDev = (isset($_GET['dev'])) ? true : false;;
    
    // Config
    $_BASE_URL = "http://10.0.0.9/ozzik4/";

    $page = (isset($_GET['page'])) ? $_GET['page'] : false;
    $meta = (isset($_GET['meta'])) ? $_GET['meta'] : false;
    $meta2 = (isset($_GET['meta2'])) ? $_GET['meta2'] : false;
    $_page = null;
    $_meta = null;
    $_meta2 = null;

    // Synthesizing meta data
    if (strpos('$meta', "/") !== FALSE) {
        $meta = explode("/", $meta);
        var_dump($meta);
    }

    // Home page
    if (!$page || $meta === "concepts" || $meta === "freebies") {
        $_page = "home";
        $_meta = ($meta) ? $meta : "products";
        $_meta = "'$_meta'";
    } else if ($page === "project") { // Product Page
        $_page = "project";
        $_meta = "{'collection': '$meta2', 'item': '$meta'}";

        if ($isDev) {
            $_meta2 = $meta2;
            $_meta = $meta;
            include_once("project-test.php");
            exit;
        }
    } else if ($page === "data") { // Data .json
        generate_project_json($meta2, $meta);
    }


    // Acutal page
    if ($_page !== null) {
        include_once("home.php");
    }

    function generate_project_json($collection, $project) {
        $projectMeta = file_get_contents("data/$collection/$project.meta.json");
        $json = json_decode($projectMeta);

        // Inserting content HTML
        $projectContent = @file_get_contents("data/$collection/$project.html");
        $json -> content = $projectContent;

        header('Content-Type: application/json');
        echo json_encode($json);
    }
?>