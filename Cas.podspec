require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "CAS"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]
  s.framework    = "CleverAdsSolutions"

  s.platform     = :ios, "13.0"
  s.source       = { :git => "https://github.com/cleveradssolutions/CAS-ReactNative.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,cpp,swift}"
  s.public_header_files = "ios/**/*.h"
  
  s.requires_arc = true    
  s.static_framework = true

  s.dependency 'React-Core'
  s.dependency 'React-Codegen'
  s.dependency 'CleverAdsSolutions-Base', '~> 3.6.0'
  
end