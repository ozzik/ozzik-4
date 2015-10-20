<?php
	$_mdFlags = array(
		'isInSection' => false,
		'isInSectionText' => false,
		'isInList' => false,
		'isInListNested' => false,
		'isInColumns' => false,
		'isInCode' => false
	);

	function mdRender($md, $isDev = false) {
		global $_mdFlags;
		// $isDev = true;

		$rendered = "";
		$md = str_replace("\n\n\n", "\n$\n", $md);
		$md = str_replace("\n\n", "\n", $md);
		$i = 0;

		$elements = explode("\n", $md);

		foreach ($elements as $element) {
			if (!$isDev) {
				$rendered .= _mdParse($element, $i, $elements);
			} else {
				echo _mdParse($element, $i, $elements) . "\n\n";
			}
			$i++;
		}

		if (!$isDev) {
			$rendered .= ($_mdFlags['isInColumns']) ? '</div>' : '';
			$rendered .= ($_mdFlags['isInSectionText']) ? '</div>' : '';
			$rendered .= ($_mdFlags['isInSection']) ? '</section>' : '';
		} else {
			echo ($_mdFlags['isInColumns'] ? '</div>' : '') . "\n\n";
			echo ($_mdFlags['isInSectionText'] ? '</div>' : '') . "\n\n";
			echo ($_mdFlags['isInSection'] ? '</section>' : '')  . "\n\n";

			header("Content-Type:text/html");exit($rendered);
		}

		return $rendered;
	}

	function _mdParse($element, $index, $otherElements = false) {
		global $_mdFlags;

		$rendered = "";
		$pre = "";
		$isListItem = false;
		$isColumn = false;
		$isColumnPlain = false;
		$isMedia = false;
		$isPlain = false;

		if ($_mdFlags['isInCode']) {
			if (strpos($element, "```") !== false) {
				$_mdFlags['isInCode'] = false;
				$element = substr($element, 0, strlen($element) - 3) . '</pre></code>';	
			}
			return $element . '&#13;&#10;';
		}

		if (empty($element)) { return $rendered; }


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
		} else if (strpos($element, "*") === 0 || strpos($element, "	*") === 0) { // List item
			$rendered = _mdParseList($element, $otherElements[$index + 1]);
			$isListItem = true;
		} else if (strpos($element, "|") === 0) { // Column
			$rendered = _mdParseColumn($element);
			$isColumn = true;
			$isColumnPlain = true;
		} else if (strpos($element, "_") === 0) { // Figure column caption
			$rendered = '<figcaption class="project-figcaption">' . substr($element, 1) . '</figcaption>';
			$isColumn = true;
		} else if (strpos($element, "=") === 0) { // Conclusion
			$rendered = '<div class="project-cue project-cue-standalone project-cue-result"></div>';
			$rendered .= '<div class="project-section project-conclusion centered"><p>' . substr($element, 2) . '</p></div>';
		} else if (strpos($element, "```") === 0) { // Code block
			$rendered = '<pre><code class="code-snippet">' . substr($element, 3) . '&#13;&#10;';
			$_mdFlags['isInCode'] = true;
		} else if ($element !== "$") { // Paragraph
			$rendered = "<p>" . _mdParsePlain($element) . "</p>";
			$isPlain = true;
		} else { // Section closure
			$rendered = ($_mdFlags['isInSectionText']) ? '</div>' : '';
			$_mdFlags['isInSectionText'] = false;
		}

		if ($index === -1) { return $rendered; }

		// List clsoure
		if ($_mdFlags['isInList'] && !$isListItem) {
			$pre = ($_mdFlags['isInListNested']) ? "</ul></li></ul>" : "</ul>";
			$_mdFlags['isInListNested'] = false;
		}
		$_mdFlags['isInList'] = $isListItem;
		// Columns clsoure
		$pre = ($_mdFlags['isInColumns'] && !$isColumn) ? "</div>" : $pre;
		$_mdFlags['isInColumns'] = $isColumn;

		// Synthesizing first section
		if ($index > 0 && !$_mdFlags['isInSection'] && $isPlain) {
			$rendered = '<section><div class="project-section">' . $rendered;
			$_mdFlags['isInSection'] = true;
			$_mdFlags['isInSectionText'] = true;
		} else if (!$_mdFlags['isInSectionText'] && ($isPlain || $isColumnPlain)) {
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

		// Code
		$text = preg_replace('/`([\s\S]*?)`/', "<code>$1</code>", $text);

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

	function _mdParseVideo($video, $isColumn = false) {
		$youtubeTag = '<iframe width="$4" height="$5" src="//www.youtube.com/embed/$3?rel=0&amp;showinfo=0&amp;html5=1&amp;vq=hd720" frameborder="0" allowfullscreen></iframe>';
		$vimeoTag = '<iframe src="//player.vimeo.com/video/$3?title=0&amp;byline=0&amp;portrait=0&amp;color=cae4ed" width="$4" height="$5" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

		if (strpos($video, "self") === false) {
			$replacee = '<div class="project-figure project-video ' . (!$isColumn ? 'with-caption' : 'column column-video') . '">' . (strpos($video, "youtube") !== false ? $youtubeTag : $vimeoTag) . '<figcaption class="project-figcaption">$1</figcaption></div>';
			$regex = '/@\[([^\[]*)\]\(([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+)\)/';
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

		return $pre . _mdParseVideo(str_replace("@|", "@", $video), true);
	}

	function _mdParseImageColumn($image) {
		global $_mdFlags;
		$pre = (!$_mdFlags['isInColumns']) ? '<div class="project-figure centered with-caption">' : '';
		$_mdFlags['isInColumns'] = true;

		if ($_mdFlags['isInSectionText']) {
			$_mdFlags['isInSectionText'] = false;
			$pre = '</div>' . $pre;
		}

		return $pre . str_replace('">', ' column">', _mdParseImage(str_replace("!|", "!", $image)));
	}

	function _mdParseList($item, $nextItem) {
		global $_mdFlags;
		$pre = (!$_mdFlags['isInList']) ? '<ul class="project-cues">' : '';
		$post = '</li>';
		$_mdFlags['isInList'] = true;

		$item = str_replace("	*", "*", $item);
		$type = substr($item, 2, strpos($item, ")") - 2);
		$content = substr($item, strpos($item, ") ") + 2);

		if (isset($nextItem) && strpos($nextItem, "	*") !== false && !$_mdFlags['isInListNested']) {
			$post = '<ul class="project-cue-nested">';
			$_mdFlags['isInListNested'] = true;
		}

		return $pre . '<li class="project-cue project-cue-bullet project-cue-' . $type . '">' . $content . $post;
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