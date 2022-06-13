<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after
 *
 * @package UnderStrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
?>

	<footer id="page-footer">
		<div class="container">
			<div class="row">
				<div class="col">
					<div class="footer-logo">
						<img src="<?php the_field('footer_logo_about_footer', 'options'); ?>" alt="">
					</div>
					<!-- /.footer-logo -->
					<div class="copyright">
						<small>&copy; <?php echo(date('Y'));?> <?php the_field('copyright_text_footer', 'options'); ?></small>
					</div>
					<!-- /.copyright -->
				</div>
				<!-- /.col -->
				<div class="col">
					<div class="footer-sitemap">
						<span class="footer-title"><?php the_field('block_1_title_footer', 'options'); ?></span>
						<!-- /.footer-title -->
						<?php wp_nav_menu( array( 'theme_location' => 'servicesmenu' ) ); ?>						
					</div>
					<!-- /.footer-sitemap -->
				</div>
				<!-- /.col -->
				<div class="col">
					<div class="footer-sitemap">
						<span class="footer-title"><?php the_field('block_2_title_footer', 'options'); ?></span>
						<!-- /.footer-title -->
						<?php wp_nav_menu( array( 'theme_location' => 'supportmenu' ) ); ?>
					</div>
					<!-- /.footer-sitemap -->
				</div>
				<!-- /.col -->
				<div class="col">
					<div class="footer-sitemap">
						<span class="footer-title"><?php the_field('block_3_title_footer', 'options'); ?></span>
						<!-- /.footer-title -->
						<?php wp_nav_menu( array( 'theme_location' => 'buzzmenu' ) ); ?>
					</div>
					<!-- /.footer-sitemap -->
				</div>
				<!-- /.col -->
				<div class="col">
					<div class="footer-sitemap">
						<span class="footer-title"><?php the_field('block_4_title_footer', 'options'); ?></span>
						<!-- /.footer-title -->
						<div class="payment-cards"><img src="<?php the_field('payment_cards_logo', 'options'); ?>" alt=""></div>
						<!-- /.payment-cards -->
					</div>
					<!-- /.footer-sitemap -->
				</div>
				<!-- /.col -->
			</div>
			<!-- /.row -->
		</div>
		<!-- /.container -->
	</footer>
	<!-- /#page-footer -->
	</div>
	<!-- /.page-wrapper -->

	<?php if ( get_field( 'display_settings_poup', 'options' ) ): ?>
	<div id="cookie-notice">
		<div id="cookie-notice-in">
			<div class="notice-text">
				<?php the_field('privacy_text_popup', 'options'); ?>
			</div>
			<!-- /.notice-text -->
			<div class="notice-btns">
				<a href="#" id="accept-cookie"><?php the_field('button_1_label_popup', 'options'); ?></a>
				<a href="<?php the_field('button_2_link_popup', 'options'); ?>" target="_blank" id="more-info-cookie"><?php the_field('button_2_label_popup', 'options'); ?></a>
			</div>
			<!-- /.notice-btns -->
			<a href="javascript:void(0);" id="close-notice"></a>
		</div>
		<!-- /#cookie-notice-in -->
	</div>
	<!-- /#cookie-notice -->
	<?php else: ?>
	<?php endif; ?>

	<a id="go-to-top" href="javascript:;"><i class="fas fa-chevron-up"></i></a>

	<div class="modal-overlay disclaimer-modal" data-my-element="tooltip-modal">
		<div class="modal" data-my-element="tooltip-modal">
			<a class="close-modal">
				<img src="<?php bloginfo('template_directory'); ?>/img/ico/close.svg" alt="">
			</a>
			<!-- close modal -->
			<div class="disclaimer-modal-wrap">
				<?php the_field('form_privacy_popup', 'options'); ?>
			</div>
			<!-- /.disclaimer-modal-wrap -->
		</div>
		<!-- modal -->
	</div>

	<div id="fixed-cta">
		
		<a href="tel:<?php the_field('phone_number_side_cta', 'options'); ?>">
			<em><img src="<?php bloginfo('template_directory'); ?>/img/ico/phone.svg" alt=""></em>
			<div class="phone-text">
				<small class="label">Get a Free Estimate</small>
				<span><?php the_field('phone_number_side_cta', 'options'); ?></span>
			</div>
			<!-- // text  -->
		</a>

	</div>
	<!-- // fixed cta  -->		
	
    <?php wp_footer(); ?>

  <script>
    if (!sessionStorage.alreadyClicked) {
        jQuery('#cookie-notice').addClass('slide-up');
        sessionStorage.alreadyClicked = 1;
    }
  </script> 	

	<?php if( get_field('footer_code_snippet', 'options') ): ?>
		<?php the_field('footer_code_snippet', 'options'); ?>
	<?php endif; ?>

</body>
</html>

