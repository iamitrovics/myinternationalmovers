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
                    <h1><?php the_field('main_title_header_facts_single'); ?></h1>
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

                <?php if( have_rows('content_layout_facts') ): ?>
                    <?php while( have_rows('content_layout_facts') ): the_row(); ?>
                        <?php if( get_row_layout() == 'intro' ): ?>

                            <div class="intro">
                                <?php the_sub_field('intro_text'); ?>
                            </div>

                        <?php elseif( get_row_layout() == 'content_with_side_image' ): ?>

                            <div class="about-body" id="country-page-body">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="about-content">
                                            <div class="country-photo">
                                                <?php
                                                $imageID = get_sub_field('featured_image_side');
                                                $image = wp_get_attachment_image_src( $imageID, 'thumb-image' );
                                                $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
                                                ?> 

                                                <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" /> 
                                            </div>
                                            <!-- /.country-photo -->
                                            <?php the_sub_field('content_block'); ?>
                                        </div>
                                        <!-- /.about-content -->
                                    </div>
                                    <!-- /.col-md-12 -->
                                </div>
                                <!-- /.row -->
                            </div>
                            <!-- /.about-body -->

                        <?php elseif( get_row_layout() == 'full_width_content' ): ?>

                            <div class="about-body">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="about-content">
                                            <?php the_sub_field('content_block'); ?>
                                        </div>
                                        <!-- /.about-content -->
                                    </div>
                                    <!-- /.col-md-12 -->
                                </div>
                                <!-- /.row -->
                            </div>
                            <!-- /.about-body -->                        

                        <?php endif; ?>
                    <?php endwhile; ?>
                <?php endif; ?>            

                <!-- /.fit-wrap -->

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
