<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<base href="<?php echo $_BASE_URL; ?>" />
	<title>Ozzik4</title>
	<link href='http://fonts.googleapis.com/css?family=Bitter:400,700,400italic' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Cabin:400,600' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="assets/css/web.css" />
	<style id="styleRuntime"></style>
</head>
<body class="blocked">
	<div class="pages transformable-rough-slow" data-page="home">
		<!-- Projects -->
		<a name="projects"></a>
		<div class="page" data-for="home">
			<div class="teaserline teaserline-home bottom"></div>
			<div class="page-content va-content">
				<div class="wrapper column-4">
					<div class="home-header">
						<ul class="home-navigation titlelike columns wrapper">
							<li class="home-navigation-item column"><a href="/" class="home-navigation-link custom" data-for="products">Products</a></li>
							<li class="home-navigation-item column"><a href="concepts" class="home-navigation-link custom" data-for="concepts">Concepts</a></li>
							<li class="home-navigation-item column"><a href="freebies" class="home-navigation-link custom" data-for="freebies">Freebies</a></li>
						</ul>
					</div>
					<div class="home-work">
						<div class="strip strip-header"><div class="navline"></div></div>
						<ol class="showcases columns"></ol>
						<div class="strip"></div>
					</div>
					<div class="home-footer columns">
						<div class="column column-1"><h1 class="meta">Oz Pinhas, Product Designer</h1></div>
						<div class="column column-3"><p class="justified crowded">I solve design problems by making people’s day less ordinary, preferably with a smile. Often&nbsp;I&nbsp;also code. Sometimes people use these products. I rinse and repeat this gig.</p></div>
					</div>
				</div>
			</div>
		</div>
		<!-- About -->
		<a name="about"></a>
		<div class="page" data-for="home">
			<div class="teaserline teaserline-home top"><div class="va-wrapper teaserline-tag-wrapper"><div class="va-content"><span class="teaserline-tag">this is me</span></div></div></div>
			<div class="page-content va-content">
				<div class="about-header">
					<img src="assets/images/oz-pinhas.png" width="109" height="109" alt="Oz Pinhas - That's me" />
					<h2 class="titlelike about-title"><span>About Me</span></h2>
					<p class="metalike about-subtitle">Product Designer & FE Developer</p>
				</div>
				<dl class="about-job">
					<dt class="meta">Currently</dt>
					<dd>Product Designer at <a href="https://billguard.com" title="BillGuard" target="_blank">BillGuard</a></dd>
					<dt class="meta previously">Previously</dt>
					<dd class="previously">Product Designer & FE Dev at <a href="https://brow.si" title="Brow.si" target="_blank">Brow.si</a></dd>
				</dl>
				<p class="about-description justified column-2 wrapper">Hey there! I’m a self-taught designer, specializing in digital products, mostly web and mobile interfaces, bluntly designed to put shitload of smiles on people faces. I also have trouble stopping at the mockups phase and usually also front-end develop some of these products. Guility of 24/7 side-projecting solutions for daily things.</p>
				<ul class="about-contact-items columns column-2 wrapper">
					<li class="contact-item column bubblable"><a href="https://twitter.com/_ozzik" class="contact-link custom contact-link-twitter" title="@_ozzik on Twitter" target="_blank">Twitter</a></li>
					<li class="contact-item column bubblable"><a href="https://dribbble.com/ozzik" class="contact-link custom contact-link-dribbble" title="Oz Pinhas on Dribbble" target="_blank">Dribbble</a></li>
					<li class="contact-item column bubblable"><a href="mailto:hey@ozzik.co" class="contact-link custom contact-link-email" title="Send me a message">Email</a></li>
					<li class="contact-item column bubblable"><a href="https://github.com/ozzik" class="contact-link custom contact-link-github" title="Oz Pinhas on GitHub" target="_blank">GitHub</a></li>
					<li class="contact-item column bubblable"><a href="https://www.linkedin.com/in/ozpinhas" class="contact-link custom contact-link-linkedin" title="Oz Pinhas on LinkedIn" target="_blank">LinkedIn</a></li>
				</ul>
			</div>
			<div class="footer">
				<div class="wrapper column-2">
					<p>Lots of unwatched Grey’s Anatomy hours were spent designing and building these projects & site, please don’t be an ass and mess with copyrights, thanks.</p>
					<p>Using beautiful <a href="">Cabin</a> and <a href="">Bitter</a> typefaces.</p>
				</div>
			</div>
		</div>
	</div>
	<!-- Project -->
	<div class="project">
		<div class="project-header">
			<div class="ripple"></div>
			<div class="back-button transformable transparent"></div>
			<h1 class="project-title"></h1>
		</div>
		<div class="project-artwork"></div>
		<div class="project-body column-2 wrapper">
			<dl class="project-meta"></dl>
			<div class="project-content"></div>
		</div>
	</div>
	<!-- Overlay's -->
	<div class="overlays active">
		<div class="overlay overlay-loading">Loading</div>
	</div>
	<!-- Non-markup thingies -->
	<script type="text/javascript">
		var _BASE_URL = "<?php echo $_BASE_URL; ?>",
			_landingData = {
				page: "<?php echo $_page; ?>",
				meta: "<?php echo $_meta; ?>",
			};
	</script>
	<script type="text/javascript" src="assets/js/web.js"></script>
</body>
</html>