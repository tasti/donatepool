require 'json'

groups = {
  "A"  => ["Brazil", "Croatia", "Mexico", "Cameroon"],
  "B" => ["Spain", "Netherlands", "Chile", "Australia"],
  "C" => ["Colombia", "Greece", "Côte d'Ivoire", "Japan"],
  "D" => ["Uruguay", "Costa Rica", "England", "Italy"],
  "E" => ["Switzerland", "Ecuador", "France", "Honduras"],
  "F" => ["Argentina", "Bosnia and Herzegovina", "Iran", "Nigeria"],
  "G" => ["Germany", "Portugal", "Ghana", "USA"],
  "H" => ["Belgium", "Algeria", "Russia", "Korea Republic"]
}
json = {
  groups: []
}

Group = Struct.new("Group", :division, :teams)
groups.each do |key, array|
  group = {
    "section" => key,
    "teams" => array.map do |team|
      {
        "team" => team,
        "logo" => ""
      }
    end
  }
  json[:groups] << group
end


puts JSON.pretty_generate(json)
