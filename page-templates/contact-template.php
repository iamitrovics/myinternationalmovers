<?php
/**
 * Template Name: Contact Template
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
						<h1><?php the_field('main_title_header_contact'); ?></h1>
					</div>
					<!-- /.header-caption -->
				</div>
				<!-- /.col-md-12 -->
			</div>
			<!-- /.row -->
		</div>
		<!-- /.container -->
	</header>
	
	<section id="about-page" class="section-area contact-body">
		<div class="container">
			<div class="row">
				<div class="col-md-12">
					<div class="about-body">
						<div class="row">
							<div class="col-md-4">
								<div class="about-photo with-contact-info">
									<img src="<?php the_field('contact_image_contact_page'); ?>" alt="">
									<div class="contact-info">
										<p><strong><?php the_field('company_name_contact_page'); ?></strong></p>
										<p><strong>Phone:</strong> <a href="tel:<?php the_field('phone_number_contact_page'); ?>"><?php the_field('phone_number_contact_page'); ?></a></p>
										<p><strong>Email:</strong> <a href="mailto:<?php the_field('email_address_contact_page'); ?>"><?php the_field('email_address_contact_page'); ?></a></p>
									</div>
									<!-- /.contact-info -->
								</div>
								<!-- /.about-photo -->
							</div>
							<!-- /.col-md-6 -->
							<div class="offset-md-2 col-md-6">
								<div class="about-content">
									<?php the_field('form_text_contact_page'); ?>
									<div class="quote-form survey-form">
										<div class="quote-form-in">
											<?php the_field('form_code_contact_page'); ?>
										</div>
										<!-- /.quote-form-in -->
									</div>
									<!-- /.quote-form -->
								</div>
								<!-- /.about-content -->
							</div>
							<!-- /.col-md-6 -->
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
		<div id="cities-served">
			<div class="container">
				<div class="row">
					<div class="col-md-12">
						<h2>Cities Served</h2>
						<?php wp_nav_menu( array( 'theme_location' => 'citiesmenu' ) ); ?>
					</div>
					<!-- /.col-md-12 -->
				</div>
				<!-- /.row -->
			</div>
			<!-- /.container -->
		</div>
		<!-- /#cities-served -->
	</section>
	<!-- /#about-area -->

<?php get_footer(); ?>

