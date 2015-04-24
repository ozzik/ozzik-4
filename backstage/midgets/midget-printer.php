<?php
	define('_PAGES_DIR', "backstage/pages/");

	// Core methods
	function printPage($route, $client) {
		global $isLocal, $isMe;

		$styles = _detectStyles($client);

		$data['baseURL'] = _BASE_URL;
		if (!$client['isBot']) {
			$data['styleMain'] = _generateStyle("web." . $styles['engine']);
			$data['styleFixes'] = $styles['fixes'] ? _generateStyle('fixes/' . $styles['fixes']) : '';
			$data['templates'] = _generateTemplates();

			$data['jsMain'] = "web" . (!$isLocal ? ".min" : "");
			$data['jsPageName'] = '"' . $route['page'] . '"';
			$data['jsMetaValue'] = json_encode($route['meta']);
			$data['jsIsMeValue'] = $isMe ? "true" : "false";

			$data['analytics'] = file_get_contents("backstage/_analytics.php");
		}

		echo _generatePage($route, $client, $data, $styles);
	}

	function printProjectJSON($collection, $project) {
		_printJSON(getProjectData($collection, $project));
	}

	function printCollectionJSON($collection) {
		_printJSON(getCollectionData($collection));
	}

	// Web pages printing
	function _generatePage($route, $client, $data, $styles) {
		$page = file_get_contents(_PAGES_DIR . 'home' . ".html");

		foreach ($data as $token => $value) {
			$page = str_replace("{{" . $token . "}}", $value, $page);
		}

		return $page;
	}

	function _detectStyles($client) {
		$engine = $client['isMoz'] ? "moz" : "webkit";
		$fixes = $client['isSafari'] ? "safari" : "";
		$fixes = $client['isMoz'] ? "firefox" : $fixes;

		return array(
			'engine' => $engine,
			'fixes' => $fixes
		);
	}

	function _generateStyle($style) {
		return '<link rel="stylesheet" type="text/css" href="assets/css/' . $style . '.css" />';
	}

	function _generateTemplates() {
		$templates = scandir("templates");
		$printedTemplates = "";

		foreach ($templates as $template) {
			if ($template !== "." && $template !== ".." && $template !== ".DS_Store") {
				$templateName = str_replace(".html", "", $template);
				$templateName = strtolower(preg_replace('/([a-zA-Z])(?=[A-Z])/', '$1-', $templateName));

				$printedTemplates .= '<script type="text/template" id="tpl-' . $templateName . '">';
				$printedTemplates .= file_get_contents("templates/$template");
				$printedTemplates .= '</script>';
			}
		}

		return $printedTemplates;
	}

	// Data printing
	function _printJSON($json) {
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
		} else if (strpos($ua, "trident") !== false) {
			$page = file_get_contents("backstage/pity.html");
			$page = str_replace("<?php echo \$_BASE_URL; ?>", $_BASE_URL, $page); // Fixing PHP printing

			echo $page;

			exit;
		}
	}

?>