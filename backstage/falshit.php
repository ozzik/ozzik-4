<?php
	include_once("config.php");

	if (isset($_GET['check'])) {
		var_dump($_COOKIE[$_ME_COOKIE]);
	} elseif (isset($_GET['no'])) {
		setcookie($_ME_COOKIE, "", 1);
		echo "no more cookie for you";
	} else {
		setcookie($_ME_COOKIE, "fosho", time() + (10 * 365 * 24 * 60 * 60));
		var_dump("lots of COOKIEzz for you");
	}
?>