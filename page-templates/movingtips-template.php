<?php
/**
 * Template Name: Moving Tips Template
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
                        <h1><?php the_field('main_title_header_tips'); ?></h1>
                        <h2><?php the_field('subtitle_header_tips'); ?></h2>
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
                    <div class="about-body">
                        <div class="row">
                            <div class="col-md-8">
                                <div class="intro">
                                    <?php the_field('intro_text_tips_page'); ?>
                                </div>
                                <div class="about-content">
                                    <?php the_field('content_block_about_tips'); ?>
                                </div>
                                <!-- /.about-content -->
                            </div>
                            <!-- /.col-md-8 -->
                            <div class="col-md-4">
                                <div class="about-photo">
                                    <img src="<?php the_field('featured_image_tips_content_page'); ?>" alt="">
                                </div>
                                <!-- /.about-photo -->
                            </div>
                            <!-- /.col-md-4 -->
                        </div>
                        <!-- /.row -->
                        <div class="moving-tips">
                            <div class="row">

                                <?php if( have_rows('tips_list_moving') ): ?>
                                    <?php while( have_rows('tips_list_moving') ): the_row(); ?>

                                        <div class="col-md-4">
                                            <div class="moving-item">
                                                <?php the_sub_field('icon_code'); ?>
                                                <h4><a href="#<?php the_sub_field('anchor'); ?>"><?php the_sub_field('title'); ?></a></h4>
                                            </div>
                                            <!-- /.moving-item -->
                                        </div>
                                        <!-- /.col-md-4 -->

                                    <?php endwhile; ?>
                                <?php endif; ?>

                            </div>
                            <!-- /.row -->
                        </div>
                        <!-- /.moving-tips -->
                        <div class="tips-list">

                            <?php if( have_rows('tips_list_moving') ): ?>
                                <?php while( have_rows('tips_list_moving') ): the_row(); ?>

                                    <div class="tips-item" id="<?php the_sub_field('anchor'); ?>">
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <?php the_sub_field('icon_code'); ?>
                                            </div>
                                            <!-- /.col-sm-3 -->
                                            <div class="col-sm-9">
                                                <h3><?php the_sub_field('title'); ?></h3>
                                                <?php the_sub_field('content_block'); ?>
                                            </div>
                                            <!-- /.col-sm-9 -->
                                        </div>
                                        <!-- /.row -->
                                    </div>
                                    <!-- /.tips-item -->

                                <?php endwhile; ?>
                            <?php endif; ?>

                        </div>
                        <!-- /.tips-list -->
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

