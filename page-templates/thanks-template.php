<?php
/**
 * Template Name: Thanks Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();
?>

	<header id="inner-header">
		<div class="container">
			<div class="row">
				<div class="col-md-12">
					<div class="header-caption">
					</div>
					<!-- /.header-caption -->
				</div>
				<!-- /.col-md-12 -->
			</div>
			<!-- /.row -->
		</div>
		<!-- /.container -->
	</header>

	<div id="thankyou">
		<div class="container">
			<div class="row">
				<div class="col-md-12">
					<div id="thankyou-in">
						<h1><?php the_field('main_title_thanks'); ?></h1>
						<img src="<?php the_field('featured_image_thanks'); ?>" alt="">
						<?php the_field('content_block_thanks'); ?>
					</div>
					<!-- /#thankyou-in -->
				</div>
				<!-- /.col-md-12 -->
			</div>
			<!-- /.row -->
		</div>
		<!-- /.container -->
	</div>
	<!-- /#thankyou -->

<?php get_footer(); ?>

