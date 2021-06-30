<?php
/**
 * Template Name: About Template
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
						<h1><?php the_field('main_title_header_about'); ?></h1>
						<h2><?php the_field('subtitle_header_about'); ?></h2>
					</div>
					<!-- /.header-caption -->
				</div>
				<!-- /.col-md-12 -->
			</div>
			<!-- /.row -->
		</div>
		<!-- /.container -->
	</header>

	<section id="about-page" class="section-area">
		<div class="container">
			<div class="row">
				<div class="col-md-12">
					<div class="intro">
						<?php the_field('intro_text_intro_about'); ?>
					</div>
					<!-- /.fit-wrap -->
					<div class="about-body">

						<div class="row">
							<div class="col-md-8">
								<div class="about-content">
									<h3><?php the_field('main_title_main_about'); ?></h3>
									<?php the_field('content_block_left_about'); ?>
								</div>
								<!-- /.about-content -->
							</div>
							<!-- /.col-md-8 -->
							<div class="col-md-4">
								<div class="about-photo">
									<img src="<?php the_field('featured_image_about_page'); ?>" alt="">
								</div>
								<!-- /.about-photo -->
							</div>
							<!-- /.col-md-4 -->
						</div>
						<!-- /.row -->

						<div class="row">
							<div class="col-md-12">
								<div class="about-content">
									<h3><?php the_field('main_title_bottom_about'); ?></h3>
									<?php the_field('content_block_bottom_about'); ?>
								</div>
								<!-- /.about-content -->
							</div>
							<!-- /.col-md-12 -->
						</div>
						<!-- /.row -->

					</div>
					<!-- /.about-body -->
				</div>
				<!-- /.col-md-12 -->
			</div>
			<!-- /.row -->
		</div>
		<!-- /.container -->
	</section>
	<!-- /#about-area -->

<?php get_footer(); ?>

