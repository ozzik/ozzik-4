<?php
	define('_PAGES_DIR', "backstage/pages/");

	// Core methods
	function printPage($route, $client) {
		global $isLocal, $isMe;

		$styles = _detectStyles($client);

		$data['baseURL'] = _BASE_URL;
		$data['pageMeta'] = _templatizeWithData(file_get_contents("backstage/_header.html"), array('baseURL' => _BASE_URL));
		$data['styleMain'] = _generateStyle("web." . $styles['engine']);
		$data['styleFixes'] = $styles['fixes'] ? _generateStyle('fixes/' . $styles['fixes']) : '';
		$data['templates'] = _generateTemplates();
		$data['jsPageName'] = '"' . $route['page'] . '"';
		$data['jsMetaValue'] = json_encode($route['meta']);
		$data['jsIsMeValue'] = $isMe ? "true" : "false";
		$data['analytics'] = _loadAnalytics();

		if (!$client['isBot']) {
			$data['jsMain'] = "web" . (!$isLocal ? ".min" : "");

			$route['page'] = ($route['page'] === "home" || $route['page'] === "project") ? "home" : $route['page'];
		} else if ($route['page'] === "project") {
			$route['page'] = "project-for-bots";
		}

		$pageContent = _generatePage($route, $data);
		if ($client['isBot']) {
			$pageContent = _synthesizePage($route, $pageContent);
		}
		echo $pageContent;
	}

	function printProjectJSON($collection, $project) {
		_printJSON(getProjectData($collection, $project));
	}

	function printCollectionJSON($collection) {
		_printJSON(getCollectionData($collection));
	}

	// Web pages printing
	function _generatePage($route, $data) {
		$page = file_get_contents(_PAGES_DIR . $route['page'] . ".html");

		$page = _templatizeWithData($page, $data);

		return $page;
	}

	function _synthesizePage($route, $page) {
		$html = "";

		if ($route['page'] === "home") {
			$items = getCollectionData($route['meta']['collection']);
			$items = $items -> items;

			foreach ($items as &$item) {
				$html .= '<li class="showcase-item"><a class="showcase-item-link" href="' . _BASE_URL . $route['meta']['collection'] . "/" . $item -> id  . '">' . $item -> name . '</a></li>';
			}

			$page = str_replace('<ol class="showcases columns"></ol>', '<ol class="showcases columns">' . $html . '</ol>', $page);

			$page = str_replace('blocked', '', $page);
			$page = str_replace('overlay overlay-loading va-wrapper stacked active', 'overlay overlay-loading stacked', $page);
		} else { // Project
			$project = getProjectData($route['meta']['collection'], $route['meta']['project']);
			$data = array();

			$data['projectID'] = $project -> id;
			$data['projectCollection'] = $project -> collection;
			$data['projectName'] = $project -> name;
			$data['projectTheme'] = '<style>.c-' . $project -> id . '-main{background-color:#' . $project -> color . '}</style>';

			$data['projectMeta'] = "";
			if ($project -> meta) {
				$data['projectMeta'] = "<dt class='meta'>Recipe</dt><dd>" . $project -> meta -> recipe . "</dd>";
				$data['projectMeta'] .= "<dt class='meta'>Role</dt><dd>" . $project -> meta -> role . "</dd>";
				$data['projectMeta'] .= "<dt class='meta'>Scope</dt><dd>" . $project -> meta -> scope . "</dd>";
			}

			$data['projectText'] = $project -> synopsis -> text;
			
			$data['projectButton'] = "";
			if (isset($project -> synopsis -> link)) {
				$data['projectButton'] = '<a href="' . $project -> synopsis -> link -> url . '" target="_blank" title="Look at the thing" class="project-button custom transformable"><span class="button-caption">Get it</span></a>';
			} else if (isset($project -> synopsis -> isDead)) {
				$data['projectButton'] = '<div class="project-button custom transformable dead"><span class="button-caption">PROJECT IS DEAD</span></div>';
			}

			$data['projectContent'] = $project -> content;

			$page = _templatizeWithData($page, $data);
		}

		return $page;
	}

	function _templatizeWithData($page, $data) {
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

	function _loadAnalytics() {
		global $isMe;
		return (!$isMe) ? file_get_contents("backstage/_analytics.php") : "";
	}

	// Data printing
	function _printJSON($json) {
		header('Content-Type: application/json');
		echo json_encode($json);
	}
?>