<?php
/**
 * Template Name: Container Sizes Template
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
                        <h1><?php the_field('main_title_sizes_header'); ?></h1>
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
                    <div id="container-sizes">

                        <?php if( have_rows('data_tables_repe') ): ?>
                            <?php while( have_rows('data_tables_repe') ): the_row(); ?>

                                <div class="container-photo">
                                    <img src="<?php the_sub_field('featured_image_sheet'); ?>" alt="">
                                </div>
                                <!-- /.container-photo -->
                                <div class="container-table">
                                    <h2><?php the_sub_field('main_title_sheet'); ?></h2>
                                    <?php the_sub_field('content_block_sheet'); ?>
                                </div>
                                <!-- /.container-table -->

                            <?php endwhile; ?>
                        <?php endif; ?>

                   
                    </div>
                    <!-- /#container-sizes -->
                </div>
                <!-- /.col-md-12 -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </section>
    <!-- /#about-area -->

<?php get_footer(); ?>

