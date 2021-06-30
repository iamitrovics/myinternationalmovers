<?php
/**
 * Template Name: Portfolio Template
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
                        <h1><?php the_field('main_title_portoflio_header'); ?></h1>
                    </div>
                    <!-- /.header-caption -->
                </div>
                <!-- /.col-md-12 -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </header>

    <div id="gallery-page" class="section-area">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="gallery-items">

                        <?php 
                        $images = get_field('portfolio_gallery_portf');
                        if( $images ): ?>
                            <?php foreach( $images as $image ): ?>
                                <div class="gallery-item">
                                    <a href="<?php echo $image['sizes']['big-image']; ?>" data-fancybox="gallery">
                                        <img src="<?php echo $image['sizes']['thumb-image']; ?>" alt="">
                                        <i class="fal fa-plus-circle"></i>
                                    </a>
                                </div>
                                <!-- /.gallery-item -->
                            <?php endforeach; ?>
                        <?php endif; ?>                

                    </div>
                    <!-- /.gallery-items -->
                </div>
                <!-- /.col-md-12 -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </div>
    <!-- /#gallery-page -->

<?php get_footer(); ?>

