require 'sinatra/base'
require 'sinatra/reloader'
require 'sinatra/respond_with'
require 'json'
require 'sass'

BRAND_NAMES = [
  'Minute Maid',
  'Simply Orange',
  'Tropicana',
  "Floridas Natural"
]

DATA_HEADERS = [
  'Total Ad Awareness',
  'Unaided Brand Awareness',
  'Total Brand Awareness'
]

class MinuteMaidApp < Sinatra::Application
  use Rack::Logger

  set :bind, '0.0.0.0'
  set :root, File.dirname(__FILE__)
  set :public_folder, Proc.new { root }
  set :views, 'scss'


  get '/' do
    send_file File.expand_path('index.html', settings.root)
  end

  get /api\/index.*/ do
    json = {
      date_range: "3 months neding Nov'14",
      logo_image: "img/minute_maid_logo.png",
      headline: "brandview"
    }
    respond_to do |format|
      format.json {
        json.to_json
      }
    end
  end

  get /api\/(.*)\/summary/ do |endpoint|
    page_header =  page_header_from_endpoint(endpoint)
    page_footer = page_footer_from_endpoint(endpoint)
    summary = <<-EOT
    Bacon ipsum dolor amet leberkas cupim capicola, spare ribs beef ribs brisket sirloin
    flank bresaola meatloaf rump t-bone drumstick. Filet mignon pig chicken strip steak
    corned beef spare ribs andouille cupim pork loin tenderloin biltong. Venison pork
    chop meatball meatloaf shank capicola turducken doner swine spare ribs t-bone strip
    steak fatback prosciutto tail. Jowl sausage turducken frankfurter kevin. Venison chuck
    landjaeger ham hock andouille, fatback pancetta flank meatball pastrami bresaola
    brisket rump prosciutto. Salami spare ribs pork loin, capicola picanha beef leberkas
    chicken beef ribs. Frankfurter venison short ribs landjaeger andouille doner beef.
    EOT

    respond_to do |format|
      format.json {
        {
          page_header: page_header,
          page_footer: page_footer,
          summary: summary
        }.to_json
      }
    end
  end

  get /api\/(.*+)/ do |endpoint|
    page_header =  page_header_from_endpoint(endpoint)
    page_footer = page_footer_from_endpoint(endpoint)
    total_brands_this_request = Random.rand(BRAND_NAMES.count).round + 2
    brands = BRAND_NAMES.sample(total_brands_this_request).collect do |name|
      {
        icon_image: "/img/#{name.downcase.split.join('_')}.png",
        percentage_at_month: "#{Random.rand(60).round}",
        delta_at_month: {
          value: "#{(-5..5).to_a.sample}",
          change: %w[positive negative neutral].sample
        },
        delta_stly: {
          value: "#{(-5..5).to_a.sample}",
          change: %w[positive negative neutral].sample
        }
      }
    end

    datasets = DATA_HEADERS.collect do |title|
      {
        title: title,
        brands: brands
      }
    end

    data_header = {
      percentage_header: "Nov'14",
      delta_month_header: "&#916; from Oct'14",
      delta_stly_header: "&#916; from STLY"
    }

    json = {
      page_header: page_header,
      page_footer: page_footer,
      data_header: data_header,
      datasets: datasets
    }

    respond_to do |format|
      format.json {
        json.to_json
      }
    end
  end

  get '/css/:name.:format?' do
    scss params[:name].to_sym
  end

  private

  def category_from_endpoint(endpoint)
    category = endpoint.split('/').first
    category.split('-').map(&:capitalize).join(' ')
  end

  def page_header_from_endpoint(endpoint)
    category = category_from_endpoint(endpoint)
    {
      category: category,
      period: "3 months ending Nov'14"
    }
  end

  def page_footer_from_endpoint(endpoint)
    category = category_from_endpoint(endpoint)
    {
      date_summary: "Nov'14 (10/01/14 - 11/01/14)",
      notes: "Imagery in #{category} module a rating of Pure Squeezed and competitive products among those aware of Pure Squeezed"
    }
  end
end
