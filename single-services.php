<?php
/**
 * The template for displaying all single posts
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
                    <h1><?php the_field('main_title_service_post'); ?></h1>
                    <?php if( get_field('subtitle_service_post') ): ?>
                        <h2><?php the_field('subtitle_service_post'); ?></h2>
                    <?php endif; ?>
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
                    <?php the_field('intro_content'); ?>
                </div>
                <!-- /.fit-wrap -->

                <div class="about-body">

                    <?php if( have_rows('content_layout_service_post') ): ?>
                        <?php while( have_rows('content_layout_service_post') ): the_row(); ?>
                            <?php if( get_row_layout() == 'con_left_img_right' ): ?>

                                <div class="row content-block">
                                    <div class="col-md-8">
                                        <div class="about-content">
                                            <?php the_sub_field('content_block'); ?>
                                        </div>
                                        <!-- /.about-content -->
                                    </div>
                                    <!-- /.col-md-8 -->
                                    <div class="col-md-4">
                                        <div class="about-photo">
                                            <img src="<?php the_sub_field('featured_image'); ?>" alt="">
                                        </div>
                                        <!-- /.about-photo -->
                                    </div>
                                    <!-- /.col-md-4 -->
                                </div>
                                <!-- /.row -->

                            <?php elseif( get_row_layout() == 'image_left_content_right' ): ?>

                                <div class="row content-block">
                                    <div class="col-md-4">
                                        <div class="about-photo">
                                            <img src="<?php the_sub_field('featured_image'); ?>" alt="">
                                        </div>
                                        <!-- /.about-photo -->
                                    </div>
                                    <!-- /.col-md-4 -->                                
                                    <div class="col-md-8">
                                        <div class="about-content">
                                            <?php the_sub_field('content_block'); ?>
                                        </div>
                                        <!-- /.about-content -->
                                    </div>
                                    <!-- /.col-md-8 -->
                                </div>
                                <!-- /.row -->

                            <?php elseif( get_row_layout() == 'full_width_content' ): ?>

                                <div class="row content-block">
                                    <div class="col-md-12">
                                        <div class="about-content">
                                            <?php the_sub_field('content_block_full'); ?>
                                        </div>
                                        <!-- /.about-content -->
                                    </div>
                                    <!-- /.col-md-8 -->
                                </div>
                                <!-- /.row -->          

                            <?php elseif( get_row_layout() == 'movers_list' ): ?>     
                                <h3><?php the_sub_field('main_title_movers'); ?></h3>

                                <div class="row from-to-list">
                                    <div class="col-md-6">
                                          <?php the_sub_field('content_left'); ?>
                                    </div>
                                    <!-- /.col -->
                                    <div class="col-md-6">
                                        <?php the_sub_field('content_right_movers'); ?>
                                    </div>
                                    <!-- /.col -->
                                </div>
                                <!-- /.row -->                                             

                            <?php endif; ?>
                        <?php endwhile; ?>
                    <?php endif; ?>                

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

<?php
get_footer();
