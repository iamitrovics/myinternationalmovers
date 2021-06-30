<?php 
/**
 * Homepage / Front Page
**/
get_header(); ?>

    <header id="masheader" style="background-image: url(<?php the_field('background_image_hero_home'); ?>);">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <?php include 'inc_quote_form.php';?>
                    <div class="header-caption">
                        <span class="heading-title"><?php the_field('main_title_hero_home'); ?></span>
                        <?php the_field('content_block_hero_home'); ?>
                    </div>
                    <!-- /.header-caption -->
                </div>
                <!-- /.col-lg-6 -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </header>

    <section id="about-area" class="section-area">
        <div class="container">
            <div class="row">
                <div class="col-lg-6">
                    <h1><?php the_field('main_title_about_home'); ?></h1>
                    <?php the_field('content_block_about_home'); ?>
                </div>
                <!-- /.col-md-12 -->
                <div class="col-lg-6">
                    <div class="quote-form">
                        <div class="quote-form-in">
                            <?php the_field('form_code_home'); ?>
                        </div>
                        <!-- /.quote-form-in -->
                    </div>
                    <!-- /.quote-form -->                    
                </div>
                <!-- /.col-md-6 -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </section>
    <!-- /#about-area -->

    <div id="moving-steps" class="section-area">
        <section class="moving-step">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="intro">
                            <h2><?php the_field('main_title_afford_middle', 'options'); ?></h2>
                            <?php the_field('intro_text_middle_area', 'options'); ?>
                        </div>
                        <!-- /.intro -->
                    </div>
                    <!-- /.col-md-12 -->
                </div>
                <!-- /.row -->
                <div class="row step-handler">
                    <div class="col-lg-6">
                        <div class="moving-steps-list">
                            <ol>
                                <?php if( have_rows('steps_list_middle_area', 'options') ): ?>
                                    <?php while( have_rows('steps_list_middle_area', 'options') ): the_row(); ?>

                                        <li>
                                            <h3><?php the_sub_field('title'); ?></h3>
                                            <p><?php the_sub_field('text'); ?></p>
                                        </li>

                                    <?php endwhile; ?>
                                <?php endif; ?>
                            </ol>
                        </div>
                        <!-- /.moving-steps-list -->
                    </div>
                    <!-- /.col-lg-6 -->
                    <div class="col-lg-6 moving-steps-photo">
                        <img src="<?php the_field('featured_image_middle_area', 'options'); ?>" alt="">
                    </div>
                    <!-- /.col-lg-6 .moving-steps-photo -->
                </div>
                <!-- /.row -->
            </div>
            <!-- /.container -->
        </section>
        <!-- /.moving-step -->

        <section class="moving-step">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="intro">
                            <h2><?php the_field('main_title_help_middle', 'options'); ?></h2>
                            <?php the_field('intro_text_help_middle', 'options'); ?>
                        </div>
                        <!-- /.intro -->
                    </div>
                    <!-- /.col-md-12 -->
                </div>
                <!-- /.row -->
                <div class="row step-handler">
                    <div class="col-lg-6">
                        <div class="moving-steps-list">
                            <ol>
                                <?php if( have_rows('steps_list_middle_area_help', 'options') ): ?>
                                    <?php while( have_rows('steps_list_middle_area_help', 'options') ): the_row(); ?>

                                        <li>
                                            <h3><?php the_sub_field('title'); ?></h3>
                                            <p><?php the_sub_field('text'); ?></p>
                                        </li>

                                    <?php endwhile; ?>
                                <?php endif; ?>                            
                            </ol>
                        </div>
                        <!-- /.moving-steps-list -->
                    </div>
                    <!-- /.col-lg-6 -->
                    <div class="col-lg-6 moving-steps-photo">
                        <img src="<?php the_field('featured_image_help_middle', 'options'); ?>" alt="">
                    </div>
                    <!-- /.col-lg-6 .moving-steps-photo -->
                </div>
                <!-- /.row -->
            </div>
            <!-- /.container -->
        </section>
        <!-- /.moving-step -->
        <section class="moving-step">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="intro">
                            <h2><?php the_field('main_title_types_middle', 'options'); ?></h2>
                            <?php the_field('intro_text_ship_middle', 'options'); ?>
                        </div>
                        <!-- /.intro -->
                        <?php the_field('content_block_ship_middle', 'options'); ?>
                    </div>
                    <!-- /.col-md-12 -->
                </div>
                <!-- /.row -->
                <div class="row step-handler">
                    <div class="col-lg-6">
                        <div class="moving-steps-list">
                            <ol>
                                <?php if( have_rows('steps_list_middle_area_shipment', 'options') ): ?>
                                    <?php while( have_rows('steps_list_middle_area_shipment', 'options') ): the_row(); ?>
                                        <li>
                                            <h3><?php the_sub_field('title'); ?></h3>
                                            <p><?php the_sub_field('text'); ?></p>
                                        </li>
                                    <?php endwhile; ?>
                                <?php endif; ?>
                            </ol>
                        </div>
                        <!-- /.moving-steps-list -->
                    </div>
                    <!-- /.col-lg-6 -->
                    <div class="col-lg-6 moving-steps-photo">
                        <img src="<?php the_field('featured_image_ship_middle', 'options'); ?>" alt="">
                    </div>
                    <!-- /.col-lg-6 .moving-steps-photo -->
                </div>
                <!-- /.row -->
            </div>
            <!-- /.container -->
        </section>
        <!-- /.moving-step -->
    </div>
    <!-- /#moving-steps -->

    <div id="call-area">
        <a href="<?php the_field('cta_link_middle_cta', 'options'); ?>"><?php the_field('cta_label_middle_cta', 'options'); ?></a>
    </div>
    <!-- /#call-area -->

    <div class="middle-full-bg">
        <img src="<?php the_field('featured_image_cargo_middle', 'options'); ?>" alt="">
    </div>
    <!-- /.middle-full-bg -->

    <div id="why-choose" class="section-area">
        <section class="moving-step">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="intro">
                            <h2><?php the_field('main_title_storage_middle', 'options'); ?></h2>
                            <?php the_field('intro_text_storage_middle'); ?>
                        </div>
                        <!-- /.intro -->
                    </div>
                    <!-- /.col-md-12 -->
                </div>
                <!-- /.row -->
                <div class="row step-handler">
                    <div class="col-lg-6">
                        <div class="moving-steps-list">
                            <ol>
                                <?php if( have_rows('steps_list_middle_area_storage_middle', 'options') ): ?>
                                    <?php while( have_rows('steps_list_middle_area_storage_middle', 'options') ): the_row(); ?>
                                        <li>
                                            <h3><?php the_sub_field('title'); ?></h3>
                                            <p><?php the_sub_field('text'); ?></p>
                                        </li>
                                    <?php endwhile; ?>
                                <?php endif; ?>
                            </ol>
                        </div>
                        <!-- /.moving-steps-list -->
                    </div>
                    <!-- /.col-lg-6 -->
                    <div class="col-lg-6 moving-steps-photo">
                        <img src="<?php the_field('featured_image_storage_middle', 'options'); ?>" alt="">
                    </div>
                    <!-- /.col-lg-6 .moving-steps-photo -->
                </div>
                <!-- /.row -->
            </div>
            <!-- /.container -->
        </section>
        <!-- /.moving-step -->

        <section class="moving-step">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="intro">
                            <h2><?php the_field('main_title_why_middle', 'options'); ?></h2>
                            <?php the_field('content_block_why_middle', 'options'); ?>
                        </div>
                        <!-- /.intro -->
                    </div>
                    <!-- /.col-md-12 -->
                </div>
                <!-- /.row -->
                <div class="row step-handler">
                    <div class="col-lg-6">
                        <div class="moving-steps-list">
                            <ol>
                                <?php if( have_rows('steps_list_middle_area_why_middle', 'options') ): ?>
                                    <?php while( have_rows('steps_list_middle_area_why_middle', 'options') ): the_row(); ?>
                                        <li>
                                            <h3><?php the_sub_field('title'); ?></h3>
                                            <p><?php the_sub_field('text'); ?></p>
                                        </li>
                                    <?php endwhile; ?>
                                <?php endif; ?>
                            </ol>
                        </div>
                        <!-- /.moving-steps-list -->
                    </div>
                    <!-- /.col-lg-6 -->
                    <div class="col-lg-6 moving-steps-photo">
                        <img src="<?php the_field('featured_image_why_middle', 'options'); ?>" alt="">
                    </div>
                    <!-- /.col-lg-6 .moving-steps-photo -->
                </div>
                <!-- /.row -->
            </div>
            <!-- /.container -->
        </section>
        <!-- /.moving-step -->

    </div>
    <!-- /#why-choose -->

    <div id="estimate-area" class="section-area">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <h2><?php the_field('main_title_bottom_cta', 'options'); ?></h2>
                    <?php the_field('content_block_bottom_cta'); ?>
                    <a href="<?php the_field('button_link_bottom_cta', 'options'); ?>" class="getbtn"><?php the_field('button_label_bottom_cta', 'options'); ?></a>
                    <!-- /.getbtn -->
                </div>
                <!-- /.col-md-12 -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </div>
    <!-- /#estimate-area -->

    <div id="reviews" style="background-image: url(<?php the_field('background_image_reviews_middle', 'options'); ?>)" class="section-area">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="video-holder">
                        <?php the_field('video_review_home'); ?>
                    </div>
                    <!-- /.video-holder -->
                    <div class="latest-reviews">
                        <h2><?php the_field('main_title_reviews_home', 'options'); ?></h2>
                        <div class="row">

                            <?php
                                $post_objects = get_field('home_reviews');

                                if( $post_objects ): ?>
                                    <?php foreach( $post_objects as $post): // variable must be called $post (IMPORTANT) ?>
                                        <?php setup_postdata($post); ?>

                                        <div class="col-lg-4">
                                            <div class="review-item">
                                                <div class="star-area">
                                                    <span class="mr-star-rating"> 
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                    </span>
                                                </div>
                                                <span class="review-author"><?php the_title(); ?></span>
                                                <?php the_field('review_content'); ?>
                                            </div>
                                            <!-- /.review-item -->
                                        </div>
                                        <!-- /.col-lg-4 -->

                                    <?php endforeach; ?>
                                <?php wp_reset_postdata(); // IMPORTANT - reset the $post object so the rest of the page works correctly ?>
                            <?php endif; ?>

                        </div>
                        <!-- /.row -->
                        <div class="row">
                            <div class="col-md-12">
                                <div class="view-all-holder">
                                    <a href="<?php the_field('button_link_reviews_gen', 'options'); ?>"><?php the_field('button_label_reviews_gen', 'options'); ?></a>
                                </div>
                                <!-- /.view-all-holder -->
                            </div>
                            <!-- /.col-md-12 -->
                        </div>
                        <!-- /.row -->
                    </div>
                    <!-- /.latest-reviews -->
                </div>
                <!-- /.col-md-12 -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </div>
    <!-- /#reviews -->

    <div id="trusted-area">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <h2><?php the_field('main_title_trusted_general', 'options'); ?></h2>
                    <div class="trusted-logos">
                        <ul>
                            <?php if( have_rows('trusted_list_general', 'options') ): ?>
                                <?php while( have_rows('trusted_list_general', 'options') ): the_row(); ?>
                                    <li><a href="<?php the_sub_field('link_to'); ?>" target="_blank"><img src="<?php the_sub_field('logo'); ?>" alt=""></a></li>
                                <?php endwhile; ?>
                            <?php endif; ?>
                        </ul>
                    </div>
                </div>
                <!-- /.col-md-12 -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </div>
    <!-- /#trusted-area -->

    <div id="cities-list">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="cities-in">
                        <?php wp_nav_menu( array( 'theme_location' => 'citiesmenu' ) ); ?>
                    </div>
                    <!-- /.cities-in -->
                </div>
                <!-- /.col-md-12 -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </div>
    <!-- /#cities-list -->

<?php get_footer(); ?>
