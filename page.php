<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
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
                        <h1><?php the_field('main_title_header_regular'); ?></h1>
                        <h2><?php the_field('subtitle_header_regular'); ?></h2>
                    </div>
                    <!-- /.header-caption -->
                </div>
                <!-- /.col-md-12 -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </header>

    <section id="regular-page" class="section-area">
        <div class="container">
            <div class="row">
                <div class="col-md-12">

                    <?php if( have_rows('content_layout_regular') ): ?>
                        <?php while( have_rows('content_layout_regular') ): the_row(); ?>
                            <?php if( get_row_layout() == 'full_width_content' ): ?>
                                <?php the_sub_field('content_block'); ?>
                            <?php elseif( get_row_layout() == 'image' ): ?>

                            <?php endif; ?>
                        <?php endwhile; ?>
                    <?php endif; ?>

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
