import { generateAssessmentSummary } from './src/ai/flows/generate-assessment-summary.ts';

async function testAnalyzer() {
  console.log('🧪 Testing Certified Food Health Analyzer...\n');
  
  try {
    const result = await generateAssessmentSummary({
      ingredients: "Oats, honey, almonds, dried cranberries, coconut oil",
      foodName: "Homemade Granola Bar",
      foodType: "snack",
      condition: "diabetes",
      objective: "blood sugar control",
      diet: "vegetarian",
      age: "35",
      sex: "F",
      activityLevel: "moderate"
    });
    
    console.log('✅ Test Result:');
    console.log('================');
    console.log(result.summary);
    console.log('\n');
    
    // Test with different context
    console.log('🧪 Testing with heart health context...\n');
    
    const result2 = await generateAssessmentSummary({
      ingredients: "Salmon, olive oil, lemon, garlic, herbs",
      foodName: "Grilled Salmon",
      foodType: "meal",
      condition: "heart disease",
      objective: "cholesterol management",
      diet: "pescatarian",
      age: "45",
      sex: "M",
      activityLevel: "high"
    });
    
    console.log('✅ Second Test Result:');
    console.log('======================');
    console.log(result2.summary);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAnalyzer();