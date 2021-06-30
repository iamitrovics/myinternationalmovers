<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @package UnderStrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();

$container = get_theme_mod( 'understrap_container_type' );
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
						<h1><?php the_field('main_title_ermac', 'options'); ?></h1>
						<img src="<?php the_field('featured_image_ermac', 'options'); ?>" alt="">
						<?php the_field('content_block_ermac', 'options'); ?>
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

<?php
get_footer();
