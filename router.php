<?php
	include_once("backstage/config.php");
	include_once("backstage/midgets/midget-detector.php");
	include_once("backstage/midgets/midget-data.php");
	include_once("backstage/midgets/midget-printer.php");

	// Project names mapping
	$PROJECT_MAPPING = array(
		"browsi-menu" => "brmenu",
		"browsi-app" => "brapp",
		"browsi-dashboard" => "brdashboard",
		"browsi-email" => "bremail",
		"browsi-v1-icon" => "bricon"
	);

	// Client + enviornment detection
	$isDev = (isset($_GET['dev'])) ? true : false;
	$isMe = (isset($isMe)) ? $isMe : isset($_COOKIE[_ME_COOKIE]);
	$isLocal = (isset($isLocal)) ? $isLocal : false;
	$client = detectClient();
	$route = array(
		'page' => '',
		'meta' => array(),
		'project' => '',
		'isData' => ''
	);

	// Routing detection
	$requestPage = (isset($_GET['page'])) ? $_GET['page'] : false;
	$requestCollection = (isset($_GET['collection'])) ? str_replace(".html", "", $_GET['collection']) : false;
	$requestProject = (isset($_GET['project'])) ? $_GET['project'] : false;

	// Synthesizing routing info
	if ($requestPage !== "data" && (!$requestPage || $requestPage === "home")) {
		$route['page'] = "home";
	} else if ($requestPage === "project") { // Product Page
		if (array_key_exists($requestCollection, $PROJECT_MAPPING)) {
			$requestCollection = $PROJECT_MAPPING[$requestCollection];
		}

		$route['page'] = "project" . ($isDev ? "-test" : "");

		// TODO: test
	} else {
		$route['isData'] = true;
	}
	$route['meta']['collection'] = ($requestCollection) ? $requestCollection : "products";
	$route['meta']['project'] = ($requestProject) ? $requestProject : "";

	// Routing...
	if ($route['page']) {
		printPage($route, $client);
	} else if ($route['isData']) { // Data .json
		if ($requestProject) {
			printProjectJSON($route['meta']['collection'], $route['meta']['project']);
		} else {
			printCollectionJSON($route['meta']['collection']);
		}
	}
?>