#!/usr/bin/env ruby

def exec(cmd)
  puts cmd
  system cmd
end

unless `git status --short`.chomp.empty?
  puts 'working directory does not clean!'
  exit 1
end


puts 'start deploy'
puts


files = %w[
  bower_components/bootstrap/dist/css/bootstrap.min.css
  bower_components/vue/dist/vue.min.js
  bower_components/lodash/lodash.min.js
  bower_components/UUID.js/dist/uuid.core.js
  bower_components/notify.js/notify.js

  bower_components/octicons/octicons/octicons.css
  bower_components/octicons/octicons/octicons.ttf
  bower_components/octicons/octicons/octicons.eot
  bower_components/octicons/octicons/octicons.svg
  bower_components/octicons/octicons/octicons.woff

  css/main.css
]

puts "start git add"
puts

files.each do |f|
  cmd =  "git add --force #{f}"
  unless exec(cmd)
    puts "`#{cmd}` failed."
    exit 1
  end
end

unless exec 'git commit -m "deploy by script"'
  puts 'git commit failed.'
  exit 1
end


exec "git push --force origin #{`git symbolic-ref --short HEAD`.chomp}:gh-pages"

exec 'git reset @~'
