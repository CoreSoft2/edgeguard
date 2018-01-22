require 'webrick'

# Useful for testing. This serves all the files in the source directory. It also binds to all addresses and has CORS
# enabled, so you can use it to serve the edgeguard.js file in another application.
# Usage: ruby server.rb

root_dir = Dir.pwd
puts "Root: #{root_dir}"
server = WEBrick::HTTPServer.new(:Port => 3005, :DocumentRoot => root_dir, :Binding => '0.0.0.0')
server.mount_proc '/' do |req, res|
  res['Access-Control-Allow-Origin'] = '*'
  filename = req.path
  filename = '/index.html' if req.path == '/'
  res.body = File.read(File.join(root_dir, filename))
end

server.start
