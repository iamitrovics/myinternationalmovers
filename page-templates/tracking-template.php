<?php
/**
 * Template Name: Track Shipment Template
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
                    <h1><?php the_field('main_title_header_track'); ?></h1>
                    <h2><?php the_field('main_title_header_track'); ?></h2>
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
                            <div class="about-content">
                               
                               <?php the_field('content_block_tracker'); ?>
                                <div class="quote-form">
                                    <div class="quote-form-in">

                                        <?php the_field('form_code_tracking'); ?>

                                    </div>
                                    <!-- /.quote-form-in -->
                                </div>
                                <!-- /.quote-form -->
                            </div>
                            <!-- /.about-content -->
                        </div>
                        <!-- /.col-md-8 -->
                        <div class="col-md-4">
                            <div class="about-photo">
                                <img src="<?php the_field('featured_image_track'); ?>" alt="">
                            </div>
                            <!-- /.about-photo -->
                        </div>
                        <!-- /.col-md-4 -->
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

