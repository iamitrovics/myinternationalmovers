<?php
/**
 * Template Name: Country Facts Template
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
                    <h1><?php the_field('main_title_header_country'); ?></h1>
                    <h2><?php the_field('subtitle_header_country'); ?></h2>
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
                                <?php the_field('intro_text_country_facts'); ?>
                            </div>
                            <!-- /.about-content -->
                        </div>
                        <!-- /.col-md-8 -->
                        <div class="col-md-4">
                            <div class="about-photo">
                                <img src="<?php the_field('featured_image_coun_facts'); ?>" alt="">
                            </div>
                            <!-- /.about-photo -->
                        </div>
                        <!-- /.col-md-4 -->
                    </div>
                    <!-- /.row -->
                    <div class="row">
                        <div class="col-md-12">
                            <div class="countries-list">

                                <h3><?php the_field('main_title_countries_list'); ?></h3>
                                <div class="row">

                                    <?php if( have_rows('countries_list_repe') ): ?>
                                        <?php while( have_rows('countries_list_repe') ): the_row(); ?>

                                            <div class="col">

                                                <?php if( have_rows('countries') ): ?>
                                                    <?php while( have_rows('countries') ): the_row(); ?>

                                                    <p><strong>-<?php the_sub_field('letter'); ?>-</strong></p>
                                                    <ul>
                                                        <?php if( have_rows('countries_inner') ): ?>
                                                            <?php while( have_rows('countries_inner') ): the_row(); ?>
                                                                <li><a href="<?php the_sub_field('link_to_country'); ?>"><?php the_sub_field('title'); ?></a></li>
                                                            <?php endwhile; ?>
                                                        <?php endif; ?>
                                                    </ul>

                                                    <?php endwhile; ?>
                                                <?php endif; ?>

                                            </div>
                                            <!-- /.col -->

                                        <?php endwhile; ?>
                                    <?php endif; ?>

                                </div>
                                <!-- /.row -->
                            </div>
                            <!-- /.countries-list -->
                        </div>
                        <!-- /.col-md-12 -->
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

