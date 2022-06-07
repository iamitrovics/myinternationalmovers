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
                                <span>
                                    Posted <a href="javascript:;"><?php echo get_the_date( 'F j, Y' ); ?></a> In 
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
                                <div class="author-desc">
                                    <?php echo get_avatar( get_the_author_meta( 'ID' ), 60 ); ?>
                                    <div class="author-content">
                                        <a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ) ); ?>"><?php the_author(); ?></a>
                                        <p><?php the_author_description(); ?></p>
                                    </div>
                                    <!-- /.author-content -->
                                </div> 
                            </div>
                            <!-- /.blog-meta -->
                            <!-- <div class="blog-action">
                                <a href="#"><i class="far fa-print"></i></a>
                            </div>
                             /.blog-action -->
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

                                    <?php elseif( get_row_layout() == 'accordion' ): ?>		

                                        <div class="default-accordion">
                                            <h3><?php the_sub_field('accordion_title'); ?></h3>
                                            <?php if( have_rows('accordion_list') ): ?>
                                                <?php while( have_rows('accordion_list') ): the_row(); ?>

                                                    <div class="faq-box">
                                                        <h4><?php the_sub_field('heading'); ?></h4>

                                                        <div>
                                                            <?php the_sub_field('content'); ?>
                                                            <!-- /.faq-box -->
                                                        </div>
                                                        <!-- /.faq-box -->
                                                    </div>

                                                <?php endwhile; ?>
                                            <?php endif; ?>
                                        </div>
                                        <!-- /.default-accordion -->
                                    
                                    <?php elseif( get_row_layout() == 'quote_cta' ): ?>

                                    <div class="quote-cta--single">
                                        <span class="title"><?php the_sub_field('cta_title'); ?></span>
                                        <a href="#bottom-form" class="btn-cta"><?php the_sub_field('button_label'); ?></a>
                                    </div>
                                    <!-- // single  --> 
                                    
                                    <?php elseif( get_row_layout() == 'featured_article' ): ?>    
                                        <?php
                                            $post_objects = get_sub_field('featured_article_list');

                                            if( $post_objects ): ?>
                                                <?php foreach( $post_objects as $post): // variable must be called $post (IMPORTANT) ?>
                                                    <?php setup_postdata($post); ?>
                                                        
                                                    <div class="featured-article">
                                                        <div class="blog-item">
                                                            <div class="blog-photo">
                                                                <a href="<?php echo get_permalink(); ?>" target="_blank">
                                                                    <?php 
                                                                    $values = get_field( 'featured_image_blog' );
                                                                    if ( $values ) { ?>
                                                                        <?php
                                                                        $imageID = get_field('featured_image_blog');
                                                                        $image = wp_get_attachment_image_src( $imageID, 'blogthumb-image' );
                                                                        $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
                                                                        ?> 

                                                                        <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" />                                                     
                                                                    <?php 
                                                                    } else { ?>
                                                                        <img src="<?php bloginfo('template_directory'); ?>/img/misc/placeholder.jpg" alt="">
                                                                    <?php } ?>
                                                                </a>
                                                            </div>
                                                            <!-- /.blog-photo-->
                                                            <div class="blog-content">
                                                                <h3><a href="<?php echo get_permalink(); ?>" target="_blank"><?php the_title(); ?></a></h3>
                                                                <a href="<?php echo get_permalink(); ?>" class="read-more" target="_blank">Read More</a>
                                                            </div>
                                                            <!-- /.blog-content -->
                                                        </div>   
                                                    </div>
                                                    <!-- /.featured-article -->
                                                        
                                                <?php endforeach; ?>
                                            <?php wp_reset_postdata(); // IMPORTANT - reset the $post object so the rest of the page works correctly ?>
                                        <?php endif; ?>
                                        <?php wp_reset_postdata(); ?>

                                    <?php elseif( get_row_layout() == 'services_module' ): ?>

                                        <div id="services-area">
                                            <div class="row">

                                                <?php
                                                $post_objects = get_sub_field('services_list_blog_page');

                                                if( $post_objects ): ?>
                                                    <?php foreach( $post_objects as $post): // variable must be called $post (IMPORTANT) ?>
                                                        <?php setup_postdata($post); ?>

                                                        <div class="col-md-4">
                                                            <div class="service-item">                                                
                                                                <a href="<?php echo get_permalink(); ?>" target="_blank">
                                                                <h3><?php the_title(); ?></h3>
                                                                <a href="<?php echo get_permalink(); ?>" class="read-more" target="_blank">Learn More</a>
                                                                </a>
                                                            </div>
                                                            <!-- /.service-item -->
                                                        </div>
                                                        <!-- /.col-md-4 -->

                                                    <?php endforeach; ?>
                                                <?php wp_reset_postdata(); // IMPORTANT - reset the $post object so the rest of the page works correctly ?>
                                                <?php endif; ?>

                                            </div>
                                            <!-- /.row -->
                                        </div>
                                        <!-- /#services-area -->
                            
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

    <div id="advanced-posts">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <h2>Recent Posts</h2>
                    <div class="advanced-posts-list">
                        <div class="row">

                            <?php
                            $loop = new WP_Query( array( 'post_type' => 'post', 'posts_per_page' => 3) ); ?>  
                            <?php while ( $loop->have_posts() ) : $loop->the_post(); ?>

                                <div class="col-md-4">
                                    <div class="blog-item">
                                        <div class="blog-photo">
                                            <a href="<?php echo get_permalink(); ?>">
                                                <?php 
                                                $values = get_field( 'featured_image_blog' );
                                                if ( $values ) { ?>
                                                    <?php
                                                    $imageID = get_field('featured_image_blog');
                                                    $image = wp_get_attachment_image_src( $imageID, 'blogthumb-image' );
                                                    $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
                                                    ?> 

                                                    <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" />                                                     
                                                <?php 
                                                } else { ?>
                                                    <img src="<?php bloginfo('template_directory'); ?>/img/misc/placeholder.jpg" alt="">
                                                <?php } ?>

                                                <i class="fal fa-image"></i>
                                            </a>
                                        </div>
                                        <!-- /.blog-photo-->
                                        <div class="blog-content">
                                            <h2><a href="<?php echo get_permalink(); ?>"><?php the_title(); ?></a></h2>
                                            <a href="<?php echo get_permalink(); ?>" class="read-more">Read More</a>
                                        </div>
                                        <!-- /.blog-content -->
                                    </div>   
                                </div>
                                <!-- /.col-md-4 -->

                            <?php endwhile; ?>
                            <?php wp_reset_postdata(); ?>    
                            <?php wp_reset_query(); ?>

                        </div>
                        <!-- /.row -->

                    </div>
                    <!-- /.sidebar-posts-list -->
                </div>
                <!-- // col-lg-8  -->
            </div>
            <!-- // row  -->
        </div>
        <!-- // container  -->
    </div>
    <!-- // advanced-posts  -->
    <div id="advanced-posts">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <h2>Related Posts</h2>
                    <div class="advanced-posts-list">
                        <div class="row">

                        <?php
                            $categories =   get_the_category();
                            // print_r($categories);
                            $rp_query   =  new WP_Query ([
                                'posts_per_page'        =>  3,
                                'post__not_in'          =>  [ $post->ID ],
                                'cat'                   =>  !empty($categories) ? $categories[0]->term_id : null,

                            ]);

                            if ( $rp_query->have_posts() ) {
                                while( $rp_query->have_posts() ) {
                                    $rp_query->the_post();
                                    ?>

                                <div class="col-md-4">
                                    <div class="blog-item">
                                        <div class="blog-photo">
                                            <a href="<?php echo get_permalink(); ?>">
                                                <?php 
                                                $values = get_field( 'featured_image_blog' );
                                                if ( $values ) { ?>
                                                    <?php
                                                    $imageID = get_field('featured_image_blog');
                                                    $image = wp_get_attachment_image_src( $imageID, 'blogthumb-image' );
                                                    $alt_text = get_post_meta($imageID , '_wp_attachment_image_alt', true);
                                                    ?> 

                                                    <img class="img-responsive" alt="<?php echo $alt_text; ?>" src="<?php echo $image[0]; ?>" />                                                     
                                                <?php 
                                                } else { ?>
                                                    <img src="<?php bloginfo('template_directory'); ?>/img/misc/placeholder.jpg" alt="">
                                                <?php } ?>

                                                <i class="fal fa-image"></i>
                                            </a>
                                        </div>
                                        <!-- /.blog-photo-->
                                        <div class="blog-content">
                                            <h2><a href="<?php echo get_permalink(); ?>"><?php the_title(); ?></a></h2>
                                            <a href="<?php echo get_permalink(); ?>" class="read-more">Read More</a>
                                        </div>
                                        <!-- /.blog-content -->
                                    </div>   
                                </div>
                                <!-- /.col-md-4 -->

                                <?php
                                    }

                                    wp_reset_postdata();

                                }

                            ?>

                        </div>
                        <!-- /.row -->

                    </div>
                    <!-- /.sidebar-posts-list -->
                </div>
                <!-- // col-lg-8  -->
            </div>
            <!-- // row  -->
        </div>
        <!-- // container  -->
    </div>
    <!-- // advanced-posts  -->

<?php
get_footer();
