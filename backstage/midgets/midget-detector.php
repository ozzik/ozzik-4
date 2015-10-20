<?php
	function detectClient() {
		$ua = strtolower($_SERVER['HTTP_USER_AGENT']);
		$client = array();

		$client['isMobile'] = _isMobile($ua);
		$client['isBot'] = strpos($ua, "googlebot") !== false || strpos($ua, "facebookexternalhit") !== false;

		$client['isMoz'] = strpos($ua, "firefox") !== false;
		$client['isSafari'] = strpos($ua, "safari") !== false && (strpos($ua, "version/9.") !== false || strpos($ua, "version/8.") !== false || strpos($ua, "version/7.") !== false);
		$client['isTrident'] = strpos($ua, "trident") !== false;

		return $client;
	}

	function _isMobile($ua) {
		$isMobile = false;

		$isMobile |= (strpos($ua, "iphone") !== false);
		$isMobile |= (strpos($ua, "android") !== false);

		return $isMobile;
	}
?>