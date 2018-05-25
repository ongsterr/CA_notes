
# Write a function that takes a decimal and returns a string in base 7
# Write a function that takes a decimal and returns in in base 19

def dec_to_base7(decimal)
    result = []
    until decimal == 0
        result.push(decimal % 7)
        decimal = decimal / 7
    end
    return result.reverse.join.to_i
end

test_data1 = 12345
test_data2 = 54321
puts "Test result for #{test_data1}: #{dec_to_base7(test_data1)}"
puts "Test result for #{test_data2}: #{dec_to_base7(test_data2)}"

def dec_to_base19(decimal)
    result = []
    extra_base = ['A','B','C','D','E','F','G','H','I']
    until decimal == 0
        modular = (decimal % 19) > 9 ? extra_base[(decimal % 19) - 10] : (decimal % 19)
        result.push(modular)
        decimal = decimal / 19
    end
    return result.reverse.join
end

test_data3 = 12345
test_data4 = 54321
puts "Test result for #{test_data3}: #{dec_to_base19(test_data3)}"
puts "Test result for #{test_data4}: #{dec_to_base19(test_data4)}"

def base_converter(num, base)
    result = []
    base_number = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I']
    if base > 19 || base < 2
        return "Base conversion out of scope. Scope conversion is only possible between base 2 and base 19."
    else
        until num == 0
            modular = base_number[(num % base)]
            result.push(modular)
            num = num / base
        end
        return result.reverse.join
    end
end

puts "Test result for #{test_data1}: #{base_converter(test_data1, 7)}"
puts "Test result for #{test_data2}: #{base_converter(test_data2, 7)}"
puts "Test result for #{test_data1}: #{base_converter(test_data1, 19)}"
puts "Test result for #{test_data2}: #{base_converter(test_data2, 19)}"
puts "Test result for #{test_data1}: #{base_converter(test_data1, 22)}"
puts "Test result for #{test_data2}: #{base_converter(test_data2, 22)}"