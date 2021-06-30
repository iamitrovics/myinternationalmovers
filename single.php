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
                        <h1><?php the_title(); ?></h1>
                    </div>
                    <!-- /.header-caption -->
                </div>
                <!-- /.col-md-12 -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </header>

    <div id="blog-page">
        <div class="container">

            <div class="row">
                <div class="col-md-12">

                    <div class="blog-body">

                        
                        <div class="blog-headline">
                            <div class="blog-meta">
                                <span>By 
                                    <?php $author_id = get_the_author_meta( 'ID' ); ?>
                                    <a href="<?php echo get_author_posts_url($author_id); ?>">
                                    <?php the_author_meta( 'display_name', $author_id ); ?>   
                                </a> Posted <a href="javascript:;"><?php echo get_the_date( 'F j, Y' ); ?></a> In 
                               <?php
                               $categories = get_the_category();
                               $separator = ' ';
                               $output = '';
                               if ( ! empty( $categories ) ) {
                               foreach( $categories as $category ) {
                                   $output .= '<a href="' . esc_url( get_category_link( $category->term_id ) ) . '" alt="' . esc_attr( sprintf( __( 'View all posts in %s', 'textdomain' ), $category->name ) ) . '">' . esc_html( $category->name ) . ',</a>' . $separator;
                               }
                               echo trim( $output, $separator );
                               }
                               ?>
                                </span>
                            </div>
                            <!-- /.blog-meta -->
                            <div class="blog-action">
                                <a href="#"><i class="far fa-print"></i></a>
                            </div>
                            <!-- /.blog-action -->
                        </div>
                        <!-- /.blog-headline -->

                        <div class="blog-content">

                            <?php if( have_rows('content_layout_blog') ): ?>
                                <?php while( have_rows('content_layout_blog') ): the_row(); ?>
                                    <?php if( get_row_layout() == 'full_width_content' ): ?>

                                        <?php the_sub_field('content_block'); ?>                               
                                        
                                    <?php elseif( get_row_layout() == 'intro_text' ): ?>

                                        <div class="blog-intro">
                                            <?php the_sub_field('intro_content'); ?>
                                        </div>
                                        <!-- // intro  -->

                                    <?php elseif( get_row_layout() == 'full_width_image' ): ?>

                                        <div class="featured-photo">
                                            <?php
                                            $imageID = get_sub_field('featured_image');
                                            $image = wp_get_attachment_image_src( $imageID, 'blogarticle-image' );
                                            $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
                                            ?> 

                                            <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" /> 
                                            <div class="photo-caption">
                                                <span><?php the_sub_field('image_caption'); ?></span>
                                            </div>
                                            <!-- /.photo-caption -->
                                        </div>
                                        <!-- /.featured-photo -->    

                                    <?php elseif( get_row_layout() == 'video' ): ?>

                                        <div class="blog-video">
                                            <?php the_sub_field('video_code'); ?>                                        
                                        </div>
                                        <!-- // video                                  -->

                                    <?php endif; ?>
                                <?php endwhile; ?>
                            <?php endif; ?>                        

                            </div>
                            <!-- /.blog-content -->       

                    </div>
                    <!-- /.blog-body -->
                </div>
                <!-- /.col-md-12 -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </div>
    <!-- /#blog-page -->

<?php
get_footer();
