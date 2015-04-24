<?php
	define('_DATA_DIR', "data/");

	function getCollectionData($collection) {
		$json = json_decode(file_get_contents(_DATA_DIR . "/$collection.json"));
		$catalog = array();

		$i = 0;
		foreach ($json -> items as $item) {
			$project = _getRawProject($collection, $item);
			$json -> items[$i] = $project;

			$catalog[$item] = $i;

			$i++;
		}

		$json -> catalog = $catalog;

		return $json;
	}

	function getProjectData($collection, $project) {
		$collectionInfo = json_decode(file_get_contents(_DATA_DIR . "$collection.json"));

		$projectInfo = _getRawProject($collection, $project);
		$projectFull = json_decode(file_get_contents(_DATA_DIR . "$collection/$project.full.json"));

		$json = (object)array_merge((array)$projectInfo, (array)$projectFull);

		// Synthesized keys
		$projectContent = @file_get_contents(_DATA_DIR . "$collection/$project.html");
		$json -> collection = $collection;
		$json -> content = $projectContent;
		if (!isset($json -> meta)) {
			$json -> meta = array();
		} else {
			$json -> meta -> team = (isset($json -> meta -> team)) ? $json -> meta -> team : "";
		}

		// Similar projects
		if (isset($json -> similar)) {
			$similar = array();

			foreach ($json -> similar -> items as $projectName) {
				$projectPath = explode("/", $projectName);
				$projectCollection = (count($projectPath) === 1) ? $collection : $projectPath[0];
				$project = (count($projectPath) === 1) ? $projectName : $projectPath[1];

				$project = _getRawProject($projectCollection, $project);
				$project -> collection = $projectCollection;
				
				array_push($similar, $project);
			}

			$json -> similar -> items = $similar;
		}

		return $json;
	}

	function _getRawProject($collection, $project) {
		$project = json_decode(file_get_contents(_DATA_DIR . "$collection/$project.json"));
		$project -> url = _BASE_URL . $collection . "/" . (isset($project -> url) ? $project -> url : $project -> id);

		return $project;
	}
?>