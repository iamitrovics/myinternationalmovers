<?php
/**
 * Template Name: Testimonials Template
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
						<h1><?php the_field('main_title_header_test'); ?></h1>
						<h2><?php the_field('subtitle_header_test'); ?></h2>
					</div>
					<!-- /.header-caption -->
				</div>
				<!-- /.col-md-12 -->
			</div>
			<!-- /.row -->
		</div>
		<!-- /.container -->
	</header>

	<section id="testimonials-page" class="section-area">
		<div class="container">
			<div class="row">
				<div class="col-lg-8">
					<div class="testimonials-list">

						<?php
						$loop = new WP_Query( array( 'post_type' => 'videoreviews', 'posts_per_page' => 115) ); ?>  
						<?php while ( $loop->have_posts() ) : $loop->the_post(); ?>

							<div class="testimonial-item">
								<?php the_field('video_code_test'); ?>
							</div>

						<?php endwhile; ?>
						<?php wp_reset_postdata(); ?>      

						<?php
						$loop = new WP_Query( array( 'post_type' => 'reviews', 'posts_per_page' => 500) ); ?>  
						<?php while ( $loop->have_posts() ) : $loop->the_post(); ?>

							<div class="testimonial-item">
								<span class="subject"><?php the_field('review_title'); ?></span>
								<!-- /.subject -->
								<?php the_field('review_content'); ?>
								<span class="author"><?php the_title(); ?></span>
								<span class="rating">Rating: 
								<?php if (get_field('review_score') == '5') { ?>
									5
								<?php } elseif (get_field('review_score') == '4') { ?>
									4
								<?php } elseif (get_field('review_score') == '3') { ?>
									3
								<?php } elseif (get_field('review_score') == '2') { ?>
									2
								<?php } elseif (get_field('review_score') == '1') { ?>
									1
								<?php } ?>   								
								 
								out of 5</span>
								<div class="star-area">
									<span class="mr-star-rating"> 
										<?php if (get_field('review_score') == '5') { ?>
											<i class="fas fa-star"></i>
											<i class="fas fa-star"></i>
											<i class="fas fa-star"></i>
											<i class="fas fa-star"></i>
											<i class="fas fa-star"></i>
										<?php } elseif (get_field('review_score') == '4') { ?>
											<i class="fas fa-star"></i>
											<i class="fas fa-star"></i>
											<i class="fas fa-star"></i>
											<i class="fas fa-star"></i>
										<?php } elseif (get_field('review_score') == '3') { ?>
											<i class="fas fa-star"></i>
											<i class="fas fa-star"></i>
											<i class="fas fa-star"></i>
										<?php } elseif (get_field('review_score') == '2') { ?>
											<i class="fas fa-star"></i>
											<i class="fas fa-star"></i>
										<?php } elseif (get_field('review_score') == '1') { ?>
											<i class="fas fa-star"></i>
										<?php } ?>   									
									</span>
								</div>
							</div>
							<!-- /.testimonial-item -->

						<?php endwhile; ?>
						<?php wp_reset_postdata(); ?>      

					</div>
					<!-- /.testimonials-list -->
				</div>
				<!-- /.col-lg-7 -->
				<div class="col-lg-4">
					<div class="testimonials-aside">
						<h3><?php the_field('form_title_sidebar_test'); ?></h3>
						<div class="quote-form">
							<div class="quote-form-in">
								<?php the_field('form_code_sidebar_test'); ?>
							</div>
							<!-- /.quote-form-in -->
						</div>
						<!-- /.quote-form -->
					</div>
					<!-- /.review-aside -->
				</div>
				<!-- /.col-lg-5 -->
			</div>
			<!-- /.row -->
		</div>
		<!-- /.container -->
	</section>
	<!-- /#about-area -->

<?php get_footer(); ?>

