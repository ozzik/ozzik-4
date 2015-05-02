<?php
	$_mdFlags = array(
		'isInSection' => false,
		'isInSectionText' => false,
		'isInList' => false,
		'isInColumns' => false
	);

	function mdRender($md) {
		global $_mdFlags;

		$rendered = "";
		$md = str_replace("\n\n\n", "\n$\n", $md);
		$md = str_replace("\n\n", "\n", $md);
		$i = 0;

		$elements = explode("\n", $md);

		foreach ($elements as $element) {
			$rendered .= _mdParse($element, $i);
			// echo _mdParse($element, $i) . "\n\n";
			$i++;
		}

		$rendered .= ($_mdFlags['isInColumns']) ? '</div>' : '';
		$rendered .= ($_mdFlags['isInSectionText']) ? '</div>' : '';
		$rendered .= ($_mdFlags['isInSection']) ? '</section>' : '';
		// echo ($_mdFlags['isInColumns'] ? '</div>' : '') . "\n\n";
		// echo ($_mdFlags['isInSectionText'] ? '</div>' : '') . "\n\n";
		// echo ($_mdFlags['isInSection'] ? '</section>' : '')  . "\n\n";

		return $rendered;
	}

	function _mdParse($element, $index) {
		global $_mdFlags;

		$rendered = "";
		$pre = "";
		$isListItem = false;
		$isColumn = false;
		$isMedia = false;
		$isPlain = false;

		if ($element[0] === "#") { // Titles
			$rendered = _mdParseTitle($element);
		} else if (strpos($element, "![") === 0) { // Image
			$rendered = _mdParseImage($element);
			$isMedia = true;
		} else if (strpos($element, "!|[") === 0) { // Image column
			$rendered = _mdParseImageColumn($element);
			$isMedia = true;
			$isColumn = true;
		} else if (strpos($element, "@[") === 0) { // Video
			$rendered = _mdParseVideo($element);
			$isMedia = true;
		} else if (strpos($element, "@|[") === 0) { // Video column
			$rendered = _mdParseVideoColumn($element);
			$isMedia = true;
			$isColumn = true;
		} else if (strpos($element, "*") === 0) { // List item
			$rendered = _mdParseList($element);
			$isListItem = true;
		} else if (strpos($element, "|") === 0) { // Column
			$rendered = _mdParseColumn($element);
			$isColumn = true;
		} else if (strpos($element, "_") === 0) { // Figure column caption
			$rendered = '<figcaption class="project-figcaption">' . substr($element, 1) . '</figcaption>';
			$isColumn = true;
		} else if (strpos($element, "=") === 0) { // Conclusion
			$rendered = '<div class="project-cue project-cue-standalone project-cue-result"></div>';
			$rendered .= '<div class="project-section project-conclusion centered"><p>' . substr($element, 2) . '</p></div>';
		} else if ($element !== "$") { // Paragraph
			$rendered = "<p>" . _mdParsePlain($element) . "</p>";
			$isPlain = true;
		} else { // Section closure
			$rendered = ($_mdFlags['isInSectionText']) ? '</div>' : '';
			$_mdFlags['isInSectionText'] = false;
		}

		if ($index !== -1) { // Not synthesized by columns
			// List clsoure
			$pre = ($_mdFlags['isInList'] && !$isListItem ? "</ul>" : "");
			$_mdFlags['isInList'] = $isListItem;
			// Columns clsoure
			$pre = ($_mdFlags['isInColumns'] && !$isColumn ? "</div>" : "");
			$_mdFlags['isInColumns'] = $isColumn;
		}

		// Synthesizing first section
		if ($index > 0 && !$_mdFlags['isInSection'] && $isPlain) {
			$rendered = '<section><div class="project-section">' . $rendered;
			$_mdFlags['isInSection'] = true;
			$_mdFlags['isInSectionText'] = true;
		} else if (!$_mdFlags['isInSectionText'] && $isPlain) {
			$rendered = '<div class="project-section">' . $rendered;
			$_mdFlags['isInSectionText'] = true;
		}

		return $pre . $rendered;
	}

	function _mdParseTitle($title) {
		global $_mdFlags;

		$level = substr_count($title, "#");
		$tag = "h" . ($level + 1);
		$tagWrapper = "";

		$rendered = "<$tag>" . substr($title, $level + 1) . "</$tag>";

		if ($level === 1) {
			$tagWrapper = ($_mdFlags['isInSectionText']) ? '</div>' : '';
			$tagWrapper .= ($_mdFlags['isInSection']) ? '</section>' : '';
			$tagWrapper .= '<section><div class="project-section">';
			// var_dump($tagWrapper);exit;
			$_mdFlags['isInSection'] = true;
		} else {
			$tagWrapper = (!$_mdFlags['isInSectionText']) ? '<div class="project-section">' : '';
		}
		
		$_mdFlags['isInSectionText'] = true;

		return $tagWrapper . $rendered;
	}

	function _mdParsePlain($text) {
		// Emphasis
		$text = preg_replace('/\*([\s\S]*?)\*/', "<em>$1</em>", $text);

		// Links
		$text = preg_replace('/\[([^\[]+)\]\(([^ ]+) "([\s\S]*?)"\)/', '<a href="$2" title="$3">$1</a>', $text);

		return $text;
	}

	function _mdParseImage($image) {
		if (strstr($image, "[]") === false) { // Image with caption
			$replacee = '<figure class="project-figure $2 with-caption"><figcaption class="project-figcaption">$1</figcaption></figure>';
		} else {
			$replacee = '<figure class="project-figure $2"></figure>';
		}

		return _mdClose() . preg_replace('/!\[([^\[]*)\]\(([^\)]+)\)/', $replacee, $image);
	}

	function _mdParseVideo($video) {
		$youtubeTag = '<iframe width="$4" height="$5" src="//www.youtube.com/embed/$3?rel=0&amp;showinfo=0&amp;html5=1&amp;vq=hd720" frameborder="0" allowfullscreen></iframe>';
		$vimeoTag = '<iframe src="//player.vimeo.com/video/$3?title=0&amp;byline=0&amp;portrait=0&amp;color=cae4ed" width="$4" height="$5" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

		if (strpos($video, "self") === false) {
			$replacee = '<div class="project-figure project-video with-caption">' . (strpos($video, "youtube") !== false ? $youtubeTag : $vimeoTag) . '<figcaption class="project-figcaption">$1</figcaption></div>';
			$regex = '/@\[([^\[]+)\]\(([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+)\)/';
		} else {
			$replacee = '<video class="project-figure column project-video-inline" src="$3" controls="true" preload="none" poster="$4" loop="true" alt="$1"></video>';
			$regex = '/@\[([^\[]+)\]\(([^ ]+) ([^ ]+) ([^ ]+)\)/';
		}

		return _mdClose() . preg_replace($regex, $replacee, $video);
	}

	function _mdParseVideoColumn($video) {
		global $_mdFlags;
		$pre = (!$_mdFlags['isInColumns']) ? '<div class="project-figure project-video centered with-caption">' : '';
		$_mdFlags['isInColumns'] = true;

		if ($_mdFlags['isInSectionText']) {
			$_mdFlags['isInSectionText'] = false;
			$pre = '</div>' . $pre;
		}

		return $pre . _mdParseVideo(str_replace("@|", "@", $video));
	}

	function _mdParseImageColumn($image) {
		global $_mdFlags;
		$pre = (!$_mdFlags['isInColumns']) ? '<div class="project-figure project-video centered with-caption">' : '';
		$_mdFlags['isInColumns'] = true;

		if ($_mdFlags['isInSectionText']) {
			$_mdFlags['isInSectionText'] = false;
			$pre = '</div>' . $pre;
		}

		return $pre . str_replace('">', ' column">', _mdParseImage(str_replace("!|", "!", $image)));
	}

	function _mdParseList($item) {
		global $_mdFlags;
		$pre = (!$_mdFlags['isInList']) ? '<ul class="project-cues">' : '';
		$_mdFlags['isInList'] = true;

		$type = substr($item, 2, strpos($item, ")") - 2);
		$content = substr($item, strpos($item, ") ") + 2);

		return $pre . '<li class="project-cue project-cue-bullet project-cue-' . $type . '">' . $content . "</li>";
	}

	function _mdParseColumn($column) {
		global $_mdFlags;
		$pre = (!$_mdFlags['isInColumns']) ? '<div class="columns column-imaged">' : '';
		$_mdFlags['isInColumns'] = true;

		$rendered = _mdParse(substr($column, 1), -1);

		return $pre . '<div class="column project-column">' . $rendered . '</div>';
	}

	function _mdClose() {
		global $_mdFlags;

		// return (!empty($_mdTitles) && !$_mdFlags['isInColumns']) ? '</div>' : '';
		if ($_mdFlags['isInSectionText'] && !$_mdFlags['isInColumns']) {
			$_mdFlags['isInSectionText'] = false;
			return '</div>';
		}
		return '';
	}
?>