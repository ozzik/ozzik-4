<?php
	include_once("backstage/config.php");

	// Project names mapping
	$PROJECT_MAPPING = array(
		"browsi-menu" => "brmenu",
		"browsi-app" => "brapp",
		"browsi-dashboard" => "brdashboard",
		"browsi-email" => "bremail",
		"browsi-v1-icon" => "bricon"
	);

	$isDev = (isset($_GET['dev'])) ? true : false;
	$isMe = (isset($isMe)) ? $isMe : isset($_COOKIE[$_ME_COOKIE]);
	$isLocal = (isset($isLocal)) ? $isLocal : false;

	$page = (isset($_GET['page'])) ? $_GET['page'] : false;
	$meta = (isset($_GET['meta'])) ? str_replace(".html", "", $_GET['meta']) : false;
	$meta2 = (isset($_GET['meta2'])) ? $_GET['meta2'] : false;
	$_page = null;
	$_meta = null;
	$_meta2 = null;
	$ua = strtolower($_SERVER['HTTP_USER_AGENT']);

	// Synthesizing meta data
	if (strpos('$meta', "/") !== FALSE) {
		$meta = explode("/", $meta);
		var_dump($meta);
	}

	// Home page
	if (!$page || ($page !== "data" && ($meta === "concepts" || $meta === "freebies"))) {
		$_page = "home";
		$_meta = ($meta) ? $meta : "products";
		$_meta = "'$_meta'";
	} else if ($page === "project") { // Product Page
		if (array_key_exists($meta, $PROJECT_MAPPING)) {
			$meta = $PROJECT_MAPPING[$meta];
		}

		$_page = "project";
		$_meta = "{'collection': '$meta2', 'item': '$meta'}";

		if ($isDev) {
			$_meta2 = $meta2;
			$_meta = $meta;
			include_once("backstage/project-test.php");
			exit;
		}
	} else if ($page === "data") { // Data .json
		if ($meta2) {
			generate_project_json($meta2, $meta);
		} else {
			generate_collection_json($meta);
		}
	}

	// User agent handling
	handle_ua($ua);

	$_CUSTOM_STYLE = "";
	$_CUSTOM_STYLE = (strpos($ua, "safari") !== false && (strpos($ua, "version/8.") !== false || strpos($ua, "version/7.") !== false)) ? "safari" : "";
	$_CUSTOM_STYLE = (strpos($ua, "firefox") !== false) ? "firefox" : $_CUSTOM_STYLE;

	// Acutal page
	if ($_page !== null) {
		include_once("home.php");
	}

	function get_raw_project($collection, $project) {
		global $_BASE_URL;

		$project = json_decode(file_get_contents("data/$collection/$project.json"));
		$project -> url = $_BASE_URL . $collection . "/" . (isset($project -> url) ? $project -> url : $project -> id);

		return $project;
	}

	function generate_collection_json($collection) {
		$json = json_decode(file_get_contents("data/$collection.json"));
		$catalog = array();

		$i = 0;
		foreach ($json -> items as $item) {
			$project = get_raw_project($collection, $item);
			$json -> items[$i] = $project;

			$catalog[$item] = $i;

			$i++;
		}

		$json -> catalog = $catalog;

		header('Content-Type: application/json');
		echo json_encode($json);
	}

	function generate_project_json($collection, $project) {
		$collectionInfo = json_decode(file_get_contents("data/$collection.json"));

		$projectInfo = get_raw_project($collection, $project);
		$projectFull = json_decode(file_get_contents("data/$collection/$project.full.json"));

		$json = (object)array_merge((array)$projectInfo, (array)$projectFull);

		// Synthesized keys
		$projectContent = @file_get_contents("data/$collection/$project.html");
		$json -> collection = $collection;
		$json -> content = $projectContent;

		// Similar projects
		if (isset($json -> similar)) {
			$similar = array();

			foreach ($json -> similar -> items as $projectName) {
				$projectPath = explode("/", $projectName);
				$projectCollection = (count($projectPath) === 1) ? $collection : $projectPath[0];
				$project = (count($projectPath) === 1) ? $projectName : $projectPath[1];

				$project = get_raw_project($projectCollection, $project);
				$project -> collection = $projectCollection;
				
				array_push($similar, $project);
			}

			$json -> similar -> items = $similar;
		}

		header('Content-Type: application/json');
		echo json_encode($json);
	}

	function handle_ua($ua) {
		global $_BASE_URL;
		global $_page, $_meta, $meta, $meta2;

		$_meta_actual = str_replace("'", "", $_meta);
		$isMobile = is_mobile($ua);

		if (strpos($ua, "googlebot") !== false || strpos($ua, "facebookexternalhit") !== false) {
			if ($_page === "home") {
				$page = file_get_contents("home.php");
			} else if ($_page === "project") {
				$page = file_get_contents("backstage/project-for-bots.php");
			}

			$page = str_replace("<?php echo \$_BASE_URL; ?>", $_BASE_URL, $page); // Fixing PHP printing
			$page = str_replace(".css", ".csss", $page); // DEV
			$html = "";

			if ($_page === "home") {
				$items = json_decode(file_get_contents("data/$_meta_actual.json"));
				$items = $items -> items;

				foreach ($items as &$item) {
					$html .= '<li><a href="' . $_BASE_URL . $_meta_actual . "/" . $item -> id  . '">' . $item -> name . '</a></li>';
				}

				$page = str_replace('<ol class="showcases columns"></ol>', '<ol class="showcases columns">' . $html . '</ol>', $page);

			} else if ($_page === "project") {
				// Finding item for base data
				$items = json_decode(file_get_contents("data/$meta2.json")) -> items;
				$itemData;
				$isFound = false;
				$i = 0;

				while ($i < count($items) && !$isFound) {
					$isFound = $items[$i] -> id === $meta;

					if ($isFound) {
						$itemData = $items[$i];
					}

					$i++;
				}

				$projectFull = file_get_contents("data/$meta2/$meta.meta.json");
				$json = json_decode($projectFull);
				$projectContent = @file_get_contents("data/$meta2/$meta.html");

				$page = str_replace("{{NAME}}", $itemData -> name, $page);

				$meta = "<dt>Recipe</dt><dd>" . $json -> meta -> recipe . "</dd>";
				$meta .= "<dt>Role</dt><dd>" . $json -> meta -> role . "</dd>";
				$meta .= "<dt>Scope</dt><dd>" . $json -> meta -> scope . "</dd>";
				$page = str_replace("{{META}}", $meta, $page);

				$page = str_replace("{{CONTENT}}", $projectContent, $page);
			}
			
			echo $page;
			exit;
		} elseif ($isMobile) {
			$page = file_get_contents("backstage/mobile.php");

			$page = str_replace("<?php echo \$_BASE_URL; ?>", $_BASE_URL, $page); // Fixing PHP printing

			echo $page;

			exit;
		}
	}

	function is_mobile($ua) {
		$isMobile = false;

		$isMobile |= (strpos($ua, "iphone") !== false);
		$isMobile |= (strpos($ua, "android") !== false);

		return $isMobile;
	}
?>