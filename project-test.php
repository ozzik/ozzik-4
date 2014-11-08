<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<base href="<?php echo $_BASE_URL; ?>" />
	<title>Ozzik4</title>
	<link href='http://fonts.googleapis.com/css?family=Bitter:400,700,400italic' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Cabin:400,600' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="assets/css/web.css" />
	<style id="styleRuntime">.c-doughjs-main { background-color: #f8f3d9; }.showcase-item.c-doughjs-main { border-color: #eee9cf; }.c-doughjs h2,.c-doughjs h3,.c-doughjs h4 { color: #aca78d; }.c-doughjs .project-button { color: #b7a85a; }.c-webfyr-main { background-color: #fae1d2; }.showcase-item.c-webfyr-main { border-color: #f0d7c8; }.c-webfyr h2,.c-webfyr h3,.c-webfyr h4 { color: #ae9586; }.c-webfyr .project-button { color: #d3885b; }.c-bucketlist-main { background-color: #faf7d2; }.showcase-item.c-bucketlist-main { border-color: #f0edc8; }.c-bucketlist h2,.c-bucketlist h3,.c-bucketlist h4 { color: #aeab86; }.c-bucketlist .project-button { color: #b8af40; }.c-yo-main { background-color: #e4cbee; }.showcase-item.c-yo-main { border-color: #dac1e4; }.c-yo h2,.c-yo h3,.c-yo h4 { color: #987fa2; }.c-yo .project-button { color: #b56ad3; }.c-browsi-main { background-color: #d2e6fa; }.showcase-item.c-browsi-main { border-color: #c8dcf0; }.c-browsi h2,.c-browsi h3,.c-browsi h4 { color: #869aae; }.c-browsi .project-button { color: #67a3df; }.c-browsi-website-main { background-color: #e6edf5; }.showcase-item.c-browsi-website-main { border-color: #dce3eb; }.c-browsi-website h2,.c-browsi-website h3,.c-browsi-website h4 { color: #9aa1a9; }.c-browsi-website .project-button { color: #8fa4bc; }.c-browsi-v1-main { background-color: #cae4ed; }.showcase-item.c-browsi-v1-main { border-color: #c0dae3; }.c-browsi-v1 h2,.c-browsi-v1 h3,.c-browsi-v1 h4 { color: #7e98a1; }.c-browsi-v1 .project-button { color: #59a7c2; }.c-sptc-main { background-color: #eaedca; }.showcase-item.c-sptc-main { border-color: #e0e3c0; }.c-sptc h2,.c-sptc h3,.c-sptc h4 { color: #9ea17e; }.c-sptc .project-button { color: #a0a940; }.c-whenbus-main { background-color: #edcad5; }.showcase-item.c-whenbus-main { border-color: #e3c0cb; }.c-whenbus h2,.c-whenbus h3,.c-whenbus h4 { color: #a17e89; }.c-whenbus .project-button { color: #d06788; }.c-rsvp-main { background-color: #caeaed; }.showcase-item.c-rsvp-main { border-color: #c0e0e3; }.c-rsvp h2,.c-rsvp h3,.c-rsvp h4 { color: #7e9ea1; }.c-rsvp .project-button { color: #51b1ba; }</style>
	<link rel="stylesheet" href="assets/css/projects/<?php echo $_meta; ?>.css" />
</head>
<body class="blocked"><br>
	<!-- Project -->
	<div class="project active">
		<div class="project-body">
			<!-- <dl class="project-meta fadable"><dt class="meta">Recipe</dt>&nbsp;<dd>JS library &amp; documentation website</dd><dt class="meta">Role</dt>&nbsp;<dd>Front-end coding &amp; design</dd><dt class="meta">Scope</dt>&nbsp;<dd>Side project (Jun ‘14)</dd></dl> -->
			<div class="project-content p-doughjs c-doughjs fadable">
			<div class="project-synopsis centered column-2"><div class="project-separator s-doughjs i-doughjs"></div><h2>TL;DR</h2><figure class="doughjs-tldr"></figure><p>Common yet bit different JavaScript library, with dedicated documentation and glory website.</p><a href="https://ozzik.github.io/dough.js" target="_blank" class="project-button custom transformable "><span class="button-caption">See on GitHub</span></a><div class="project-separator s-doughjs i-doughjs"></div></div>
			<?php
			echo @file_get_contents("data/$_meta2/$_meta.html");
			?>
		</div>
	</div>
</body>