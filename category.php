<?php get_header(); ?>

    <header id="inner-header">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="header-caption">
                        <h1><?php single_cat_title('Category: '); ?></h1>
                    </div>
                    <!-- /.header-caption -->
                </div>
                <!-- /.col-md-12 -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </header>
    
    <div id="blogs">
        <div class="blog-items section-area">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">

                        <?php

                            
                            while(have_posts()): the_post(); ?>
                                                
                                <div class="blog-item">
                                    <div class="row">
                                        <div class="col-md-5">
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
                                        </div>
                                        <!-- /.col-md-5 -->
                                        <div class="col-md-7">
                                            <div class="blog-content">
                                                <div class="blog-meta">
                                                    <?php $author_id = get_the_author_meta( 'ID' ); ?>
                                                    <span><a href="<?php echo get_author_posts_url($author_id); ?>"><?php the_author_meta( 'display_name', $author_id ); ?>  </a></span> 

                                                    <span>
                                                    <?php
                                                    global $post;
                                                    $categories = get_the_category($post->ID);
                                                    $cat_link = get_category_link($categories[0]->cat_ID);
                                                    echo '<a href="'.$cat_link.'">'.$categories[0]->cat_name.'</a>' 
                                                    ?>                                                    
                                                    </span> 
                                                    <span><a href="javascript:;"><?php echo get_the_date( 'F j, Y' ); ?></a></span>
                                                </div>
                                                <!-- /.category -->
                                                <h2><a href="<?php echo get_permalink(); ?>"><?php the_title(); ?></a></h2>
                                                <?php the_field('excerpt_text'); ?>
                                                <a href="<?php echo get_permalink(); ?>" class="read-more">Read More</a>
                                            </div>
                                            <!-- /.blog-content -->
                                        </div>
                                        <!-- /.col-md-7 -->
                                    </div>
                                    <!-- /.row -->
                                </div>                           
                           
                            <?php endwhile; ?>

                        <nav class="pagination-block">
                            <?php if( function_exists('wp_pagenavi') ) wp_pagenavi(); // WP-PageNavi function ?>
                        </nav>    

                    </div>
                    <!-- /.col-md-12 -->
                </div>
                <!-- /.row -->
            </div>
            <!-- /.container -->
        </div>
        <!-- /.blog-items -->
    </div>
    <!-- /#blogs -->

<?php get_footer(); ?>
