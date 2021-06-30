<?php
/**
 * Template Name: Free Estimate Template
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
						<h1><?php the_field('main_title_header_estimate'); ?></h1>
						<h2><?php the_field('subtitle_header_estimate'); ?></h2>
					</div>
					<!-- /.header-caption -->
				</div>
				<!-- /.col-md-12 -->
			</div>
			<!-- /.row -->
		</div>
		<!-- /.container -->
	</header>

	<section id="about-page" class="section-area free-moving-estimate">
		<div class="container">
			<div class="row">
				<div class="col-md-12">
					<div class="about-body">
						<div class="row">
							<div class="col-md-12">
								<div class="about-content">
									<div class="quote-form survey-form">
										<div class="quote-form-in">
											<?php the_field('form_code_free_estimate'); ?>
										</div>
										<!-- /.quote-form-in -->
									</div>
									<!-- /.quote-form -->
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

