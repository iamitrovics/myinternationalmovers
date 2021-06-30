<?php
/**
 * Template Name: Schedule Survey Template
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
                    <h1><?php the_field('main_title_header_survey'); ?></h1>
                    <?php if( get_field('subtitle_header_survey') ): ?>
                        <h2><?php the_field('subtitle_header_survey'); ?></h2>
                    <?php endif; ?>
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
                <div class="intro">
                    <?php the_field('intro_content_survey_page'); ?>
                </div>
                <!-- /.fit-wrap -->
                <div class="about-body">
                    <div class="row">
                        <div class="col-md-8">
                            <div class="about-content">
                                <?php the_field('main_content_survey_page'); ?>
                                <div class="quote-form survey-form">
                                    <div class="quote-form-in">
                                        <form action="">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label for="">First Name*</label>
                                                        <input type="text" placeholder="First Name">
                                                    </div>
                                                    <!-- /.form-group -->
                                                </div>
                                                <!-- /.col-md-6 -->
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label for="">Last Name*</label>
                                                        <input type="text" placeholder="Last Name">
                                                    </div>
                                                    <!-- /.form-group -->
                                                </div>
                                                <!-- /.col-md-6 -->
                                            </div>
                                            <!-- /.row -->
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label for="">Email*</label>
                                                        <input type="email" placeholder="Email">
                                                    </div>
                                                    <!-- /.form-group -->
                                                </div>
                                                <!-- /.col-md-6 -->
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label for="">Phone*</label>
                                                        <input type="tel" placeholder="###-###-####">
                                                    </div>
                                                    <!-- /.form-group -->
                                                </div>
                                                <!-- /.col-md-6 -->
                                            </div>
                                            <!-- /.row -->
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label for="">Preferred Method Of Contact:*</label>
                                                        <div class="control-group">
                                                            <label class="control control--radio">
                                                                Email
                                                                <input type="radio" name="radio"/>
                                                                <div class="control__indicator"></div>
                                                            </label>
                                                            <label class="control control--radio">
                                                                Phone
                                                                <input type="radio" name="radio"/>
                                                                <div class="control__indicator"></div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <!-- /.form-group -->
                                                </div>
                                                <!-- /.col-md-12 -->
                                            </div>
                                            <!-- /.row -->
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label for="">Move Date*</label>
                                                        <input type="text" placeholder="MM/DD/YYYY" class="date-picker-input">
                                                    </div>
                                                    <!-- /.form-group -->
                                                </div>
                                                <!-- /.col-md-6 -->
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label for="">Move Size*</label>
                                                        <select name="" id="" class="selectpicker">
                                                            <option value="" selected="selected">Please select one</option>
                                                            <option value="Studio">Studio</option>
                                                            <option value="1 Bedroom">1 Bedroom</option>
                                                            <option value="2 Bedrooms">2 Bedrooms</option>
                                                            <option value="3 Bedrooms">3 Bedrooms</option>
                                                            <option value="Large House">Large House</option>
                                                            <option value="Only Select Items">Only Select Items</option>
                                                        </select>
                                                        <!-- /#.selectpicker -->
                                                    </div>
                                                    <!-- /.form-group -->
                                                </div>
                                                <!-- /.col-md-6 -->
                                            </div>
                                            <!-- /.row -->
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label for="">Moving From*</label>
                                                        <input type="text" placeholder="City, Country">
                                                    </div>
                                                    <!-- /.form-group -->
                                                </div>
                                                <!-- /.col-md-6 -->
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label for="">Moving To*</label>
                                                        <input type="text" placeholder="City, Country">
                                                    </div>
                                                    <!-- /.form-group -->
                                                </div>
                                                <!-- /.col-md-6 -->
                                            </div>
                                            <!-- /.row -->
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label for="">How did you hear about us?*</label>
                                                        <select name="" id="" class="selectpicker">
                                                            <option value="" selected="selected">- Select One -</option>
                                                            <option value="Google">Google</option><option value="Yelp!">Yelp!</option>
                                                            <option value="Yahoo">Yahoo</option>
                                                            <option value="Referral">Referral</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                        <!-- /#.selectpicker -->
                                                    </div>
                                                    <!-- /.form-group -->
                                                </div>
                                                <!-- /.col-md-12 -->
                                            </div>
                                            <!-- /.row -->
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label for="">Comment</label>
                                                       <textarea name="" id="" cols="30" rows="10"></textarea>
                                                       <!-- /# -->
                                                    </div>
                                                    <!-- /.form-group -->
                                                </div>
                                                <!-- /.col-md-12 -->
                                            </div>
                                            <!-- /.row -->
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label class="control control--checkbox">
                                                            Agree to be contacted via text
                                                            <input type="checkbox"/>
                                                            <div class="control__indicator"></div>
                                                        </label>
                                                        <a href="javascript: void(0)" class="zebra_tooltips_below" title="By listing or updating my cellular phone information, I authorize My International Movers to call or send SMS text messages using an automatic telephone dialing system or prerecorded message to my cell phone number to provide account information and services related to my long distance move. Additionally, I authorize My International Movers to follow up in order to assist me with payment reminders and provide me with opportunities to provide feedback regarding customer service. If I do not want to receive calls or SMS text messages, I can unsubscribe by sending an email to info@myinternationalmovers.com with the subject line “STOP Transaction Calls” or by calling a customer service representative at 888-888-8449. Receipt of cellular phone calls and text messages may be subject to service provider charges.">Details</a>
                                                    </div>
                                                    <!-- /.form-group -->
                                                </div>
                                                <!-- /.col-md-12 -->
                                            </div>
                                            <!-- /.row -->
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <input type="submit" value="Submit">
                                                    </div>
                                                    <!-- /.form-group -->
                                                </div>
                                                <!-- /.col-md-12 -->
                                            </div>
                                            <!-- /.row -->
                                        </form>
                                        <?php the_field('form_code_survey'); ?>
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
                                <img src="<?php the_field('featured_image_survey_page'); ?>" alt="">
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

