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
                <div class="col-lg-8 offset-lg-2">

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
                                    <div class="full-content">
                                        <?php the_sub_field('content_block'); ?>    
                                    </div> <!-- full-content -->                           
                                        
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
                                    
                                    <?php elseif( get_row_layout() == 'quote_cta' ): ?>

                                    <div class="quote-cta--single">
                                        <span class="title"><?php the_sub_field('cta_title'); ?></span>
                                        <a href="#bottom-form" class="btn-cta"><?php the_sub_field('button_label'); ?></a>
                                    </div>
                                    <!-- // single  -->                                          
                            
                                    <?php elseif( get_row_layout() == 'table' ): ?>

                                        <table style="width:100%" class="single-table">
                                            <thead>
                                                <tr role="row">

                                                <?php

                                                    // check if the repeater field has rows of data
                                                    if(have_rows('table_head_cells')):

                                                        // loop through the rows of data
                                                        while(have_rows('table_head_cells')) : the_row();

                                                            $hlabel = get_sub_field('table_cell_label_thead');

                                                            ?>  

                                                            <th tabindex="0" rowspan="1" colspan="1"><?php echo $hlabel; ?></th>

                                                        <?php endwhile;

                                                    else :
                                                        echo 'No data';
                                                    endif;
                                                    ?>

                                                </tr>
                                            </thead>
                                            <tbody>

                                            <?php while ( have_posts() ) : the_post(); ?>

                                                <?php 

                                                // check for rows (parent repeater)
                                                if( have_rows('table_body_row') ): ?>
                                                    
                                                    <?php 

                                                    // loop through rows (parent repeater)
                                                    while( have_rows('table_body_row') ): the_row(); ?>

                                                            <?php 

                                                            // check for rows (sub repeater)
                                                            if( have_rows('table_body_cells') ): ?>
                                                                <tr>
                                                                    <?php 

                                                                    // loop through rows (sub repeater)
                                                                    while( have_rows('table_body_cells') ): the_row();

                                                                        
                                                                        ?>
                                                                        <td><?php the_sub_field('table_cell_label_tbody'); ?></td>
                                                                    <?php endwhile; ?>
                                                                </tr>
                                                            <?php endif; //if( get_sub_field('') ): ?>

                                                    <?php endwhile; // while( has_sub_field('') ): ?>
                                                        
                                                <?php endif; // if( get_field('') ): ?>

                                                <?php endwhile; // end of the loop. ?>
                                                
                                            </tbody>
                                        </table>  

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

            <div id="bottom-form">
                <div class="row">
                    <div class="col-lg-8 offset-lg-2">

                        <div class="quote-form">
                            <div class="quote-form-in">
                                <?php echo do_shortcode('[contact-form-7 id="1507" title="Homepage Quote Form"]'); ?>
                            </div>
                            <!-- /.quote-form-in -->
                        </div>
                        <!-- /.quote-form -->      

                    </div>
                </div>              
            </div>

        </div>
        <!-- /.container -->
    </div>
    <!-- /#blog-page -->

<?php
get_footer();
