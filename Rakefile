require 'logger'
require 'sass'

# call dist:release when no task provided
task default: 'dist:release'

namespace :dist do
  DEBUG = false
  LOGGER = Logger.new(STDOUT)
  CURRENT_DIR =  File.dirname(__FILE__)
  DIST_DIR = File.expand_path('dist', CURRENT_DIR)
  CSS_DIR = File.join(DIST_DIR, 'css')
  JS_DIR = File.join(DIST_DIR, 'js')

  desc 'Package application for release'
  task release: [
    :clean,
    :ensure_dist_dirs_exist,
    :build_release_files
  ] do
    LOGGER.info("Generation complete. Release files are available in: #{DIST_DIR}")
  end

  desc 'Completely removes DIST_DIR'
  task :clean do
    debug("Cleaning: #{DIST_DIR}")
    FileUtils.rm_rf(DIST_DIR)
  end

  desc 'Creates DIST_DIR and any subdirectories'
  task :ensure_dist_dirs_exist do
    debug("Ensure directories exist: #{[DIST_DIR, CSS_DIR, JS_DIR].join(", ")}")
    # FileUtils.mkdir_p(CSS_DIR) also creates DIST_DIR. Dir.mkdir call left for clarity
    #Dir.mkdir(DIST_DIR) unless Dir.exists?(DIST_DIR)
    FileUtils.mkdir_p(CSS_DIR) unless Dir.exists?(CSS_DIR)
    FileUtils.mkdir_p(JS_DIR) unless Dir.exists?(JS_DIR)
  end

  desc 'Creates/Copies requisite files in DIST_DIR'
  task build_release_files: :compile_sass do
    debug("Copying HTML into: #{DIST_DIR}")
    FileUtils.cp(File.expand_path('index.html', CURRENT_DIR), DIST_DIR)

    debug("Copying JS into: #{JS_DIR}")
    FileUtils.cp_r(File.expand_path('js', CURRENT_DIR), DIST_DIR)
  end

  desc 'Compile SASS files into application.css'
  task :compile_sass do
    css_file = File.open(File.join(DIST_DIR, 'css', 'application.css'), 'wb+')
    debug("Compiling SCSS files into: #{css_file.path}")
    css_file.write(
      Sass.compile_file(
        File.expand_path(File.join('scss', 'application.scss'), CURRENT_DIR)
      )
    )
  end

  def debug(message)
    LOGGER.debug(message) if DEBUG
  end
end
