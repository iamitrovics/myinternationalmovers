<?php
/**
 * Template Name: FAQ Template
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
						<h1><?php the_field('main_title_header_faq'); ?></h1>
						<h2><?php the_field('subtitle_header_faq'); ?></h2>
					</div>
					<!-- /.header-caption -->
				</div>
				<!-- /.col-md-12 -->
			</div>
			<!-- /.row -->
		</div>
		<!-- /.container -->
	</header>

	<div id="faq">
		<div class="container">
			<div class="row">
				<div class="col-md-12">
					<div id="faq__accordion">

						<?php if( have_rows('faq_list') ): ?>
							<?php while( have_rows('faq_list') ): the_row(); ?>

								<div class="faq-wrap">
									<h3><?php the_sub_field('title'); ?></h3>
									<div>
										<?php the_sub_field('answer'); ?>
									</div>
								</div>

							<?php endwhile; ?>
						<?php endif; ?>

					</div>
					<!-- /#faq__accordion -->
				</div>
				<!-- /.col-md-12 -->
			</div>
			<!-- /.row -->
		</div>
		<!-- /.container -->
	</div>
	<!-- /#faq -->

<?php get_footer(); ?>

