<?php
/**
 * Template Name: Cities We Serve Template
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
						<h1><?php the_field('main_title_header_cities'); ?></h1>
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
					<div class="location-list">

						<?php
							// check if the repeater field has rows of data
							if(have_rows('single_area')):
								// loop through the rows of data
								while(have_rows('single_area')) : the_row();?>  
									<h2><?php the_sub_field('cities_subtitles'); ?></h2>

									<ul>
									<?php
										// check if the repeater field has rows of data
										if(have_rows('cities_single_repeater')):
											// loop through the rows of data
											while(have_rows('cities_single_repeater')) : the_row();?>  
												
												<li><a href="<?php the_sub_field('city_link_repeater'); ?>"><?php the_sub_field('city_name_repeater'); ?></a></li>
													
											<?php endwhile;
										else :
											echo 'No data';
										endif;
									?>
									</ul>

								<?php endwhile;
							else :
								echo 'No data';
							endif;
						?>

					</div>
					<!-- // list  -->
				</div>
				<!-- /.col-md-12 -->
			</div>
			<!-- /.row -->
		</div>
		<!-- /.container -->
	</section>
	<!-- /#about-area -->

<?php get_footer(); ?>

