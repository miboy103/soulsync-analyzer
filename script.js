// Quiz form handling
const quizForm = document.getElementById('quizForm');
const quizSection = document.getElementById('quizSection');
const resultsSection = document.getElementById('resultsSection');
const independenceSlider = document.getElementById('independenceSlider');
const sliderValue = document.getElementById('sliderValue');

// Update slider value display
independenceSlider.addEventListener('input', (e) => {
    sliderValue.textContent = e.target.value;
});

// Radio button styling
document.addEventListener('change', (e) => {
    if (e.target.type === 'radio' || e.target.type === 'checkbox') {
        const label = e.target.closest('label');
        if (e.target.type === 'radio') {
            // For radio buttons, remove selected from all in the same group
            const group = document.querySelectorAll(`input[name="${e.target.name}"]`);
            group.forEach(radio => {
                radio.closest('label').classList.remove('selected');
            });
        }
        label.classList.add('selected');
    }
});

// Form submission
quizForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const responses = collectResponses();
    const profile = generateProfile(responses);
    displayProfile(profile);
});

function collectResponses() {
    const formData = new FormData(quizForm);
    const responses = {};

    // Single select questions
    responses.stressResponse = formData.get('q1');
    responses.conflictResolution = formData.get('q3');
    responses.compatibility = formData.get('q5');
    responses.communication = formData.get('q9');

    // Text questions
    responses.friendsDescription = formData.get('q4');
    responses.admiredQuality = formData.get('q7');
    responses.cannotTolerate = formData.get('q10');

    // Slider
    responses.independence = parseInt(formData.get('q8'));

    // Multi-select questions (checkboxes)
    responses.relationshipValues = formData.getAll('q2');
    responses.loveLangs = formData.getAll('q6');

    return responses;
}

function generateProfile(resp) {
    const profile = {};

    // Analyze stress response
    const stressPatterns = {
        'Talk to someone': { type: 'extroverted', trait: 'communicative' },
        'Spend time alone': { type: 'introverted', trait: 'reflective' },
        'Distract myself': { type: 'avoidant', trait: 'action-oriented' },
        'Struggle to express': { type: 'reserved', trait: 'guardedEmotion' }
    };
    profile.stressPattern = stressPatterns[resp.stressResponse];

    // Determine primary values
    profile.primaryValues = resp.relationshipValues;
    profile.loveLanguages = resp.loveLangs;

    // Conflict style analysis
    const conflictStyles = {
        'Calm discussion': 'rational',
        'Cool off first': 'measured',
        'Avoid arguments': 'peacekeeping',
        'Direct confrontation': 'direct'
    };
    profile.conflictStyle = conflictStyles[resp.conflictResolution];

    // Communication preference
    profile.communicationPreference = resp.communication;

    // Compatibility preference
    profile.compatibilityPreference = resp.compatibility;

    // Independence level
    profile.independenceValue = resp.independence;

    // Text responses
    profile.selfDescription = resp.friendsDescription;
    profile.admiredQualities = resp.admiredQuality;
    profile.boundaries = resp.cannotTolerate;

    return profile;
}

function generateSoulmateTraits(profile) {
    let traits = [];
    let emotionalQualities = [];
    let communicationStyle = [];
    let sharedValues = [];
    let support = [];

    // Based on stress response
    if (profile.stressPattern.type === 'extroverted') {
        traits.push('a good listener who can hold space for sharing and processing emotions');
        support.push('thoughtful follow-ups and genuine interest in your wellbeing');
    } else if (profile.stressPattern.type === 'introverted') {
        traits.push('respectful of quiet time and comfortable with introspection');
        support.push('understanding when you need solitude to recharge');
    } else if (profile.stressPattern.type === 'avoidant') {
        traits.push('someone who can gently encourage deeper conversation');
        support.push('helping you process feelings rather than just distract');
    } else if (profile.stressPattern.type === 'reserved') {
        traits.push('patient and creating a safe space for vulnerability');
        support.push('never pressuring you to open up, but showing you it\'s safe to');
    }

    // Based on values
    if (profile.primaryValues.includes('Trust')) {
        emotionalQualities.push('consistent, reliable, and follows through on promises');
    }
    if (profile.primaryValues.includes('Communication')) {
        communicationStyle.push('articulate, willing to have difficult conversations');
    }
    if (profile.primaryValues.includes('Loyalty')) {
        traits.push('fiercely committed and stands by your side through challenges');
    }
    if (profile.primaryValues.includes('Emotional support')) {
        emotionalQualities.push('empathetic, validating, and attuned to your emotional needs');
    }
    if (profile.primaryValues.includes('Shared goals')) {
        sharedValues.push('aligned life vision and ambitious about building a future together');
    }

    // Based on conflict style
    if (profile.conflictStyle === 'rational') {
        communicationStyle.push('logical, fair-minded, and can discuss disagreements without defensiveness');
    } else if (profile.conflictStyle === 'measured') {
        communicationStyle.push('willing to take breaks during tension and revisit issues calmly');
    } else if (profile.conflictStyle === 'peacekeeping') {
        emotionalQualities.push('naturally diplomatic and conflict-averse');
        support.push('creating a harmonious environment where you both feel safe');
    } else if (profile.conflictStyle === 'direct') {
        communicationStyle.push('honest and willing to address issues head-on');
    }

    // Based on love languages
    if (profile.loveLanguages.includes('Words of affirmation')) {
        support.push('verbal appreciation and regular affirmation of their feelings for you');
    }
    if (profile.loveLanguages.includes('Quality time')) {
        support.push('prioritizing meaningful time together, even in busy schedules');
    }
    if (profile.loveLanguages.includes('Helping with things')) {
        support.push('showing up practically when you need help');
    }
    if (profile.loveLanguages.includes('Gifts')) {
        support.push('thoughtful gestures that show they pay attention to your interests');
    }
    if (profile.loveLanguages.includes('Physical affection')) {
        emotionalQualities.push('physically affectionate and comfortable with closeness');
    }

    // Based on independence
    if (profile.independenceValue >= 7) {
        traits.push('has their own passions, hobbies, and social circles');
        sharedValues.push('respect for personal autonomy and growth');
    } else if (profile.independenceValue <= 3) {
        traits.push('enjoys interdependence and building life closely together');
        emotionalQualities.push('available and present in the relationship');
    } else {
        traits.push('balanced between togetherness and individual identity');
    }

    // Based on communication preference
    if (profile.communicationPreference === 'Deep conversations') {
        traits.push('intellectually engaged and interested in meaningful dialogue');
    } else if (profile.communicationPreference === 'Direct and honest') {
        traits.push('straightforward, transparent, and values truth over comfort');
    } else if (profile.communicationPreference === 'Listening and empathy') {
        emotionalQualities.push('deeply empathetic and naturally attuned to emotional undercurrents');
    } else if (profile.communicationPreference === 'Light and humorous') {
        traits.push('playful, witty, and can find humor even in difficult moments');
    }

    // Compatibility preference
    if (profile.compatibilityPreference === 'Similar to me') {
        sharedValues.push('core similarities in values, interests, and life philosophy');
    } else if (profile.compatibilityPreference === 'Balances my personality') {
        traits.push('complementary strengths that fill your gaps and vice versa');
    } else if (profile.compatibilityPreference === 'A mix of both') {
        traits.push('shares your values but brings different perspectives and strengths');
    }

    // Add default values if needed
    if (traits.length === 0) {
        traits.push('genuine, authentic, and unapologetically themselves');
    }
    if (emotionalQualities.length === 0) {
        emotionalQualities.push('emotionally intelligent and self-aware');
    }
    if (communicationStyle.length === 0) {
        communicationStyle.push('clear, respectful communication even during disagreements');
    }
    if (sharedValues.length === 0) {
        sharedValues.push('similar core values about what matters in life');
    }

    return {
        traits,
        emotionalQualities,
        communicationStyle,
        sharedValues,
        support
    };
}



function generatePersonalitySummary(resp, profile) {
    let summary = `You are someone who values ${resp.relationshipValues.join(', ').toLowerCase()}. `;

    if (profile.stressPattern.type === 'extroverted') {
        summary += `When faced with challenges, you naturally turn to others for support, suggesting you\'re communicative and community-oriented. `;
    } else if (profile.stressPattern.type === 'introverted') {
        summary += `You process challenges internally and prefer quiet reflection, indicating you\'re thoughtful and self-reliant. `;
    } else if (profile.stressPattern.type === 'avoidant') {
        summary += `You have a tendency to stay active and engaged, showing you\'re dynamic but might benefit from deeper emotional processing. `;
    } else if (profile.stressPattern.type === 'reserved') {
        summary += `You find it challenging to express emotions easily, suggesting you may be guarded but potentially deeply introspective. `;
    }

    summary += `Your friends would likely describe you as: ${resp.friendsDescription}. In relationships, you admire ${resp.admiredQuality.toLowerCase()}, which shapes what you look for in a partner.`;

    return summary;
}

function generateRelationshipStyle(resp, profile) {
    let style = `Your relationship style reflects your `;

    if (profile.conflictStyle === 'rational') {
        style += `preference for calm, thoughtful discussions during conflict. You likely approach disagreements as problems to solve together rather than battles to win. `;
    } else if (profile.conflictStyle === 'measured') {
        style += `need for space and time to process emotions. You\'re likely mature about conflicts, understanding that sometimes stepping back leads to better solutions. `;
    } else if (profile.conflictStyle === 'peacekeeping') {
        style += `desire to maintain harmony in relationships. You may prioritize connection over being "right," though this could sometimes mean your own needs go unspoken. `;
    } else if (profile.conflictStyle === 'direct') {
        style += `belief in honest, immediate communication. You prefer addressing issues head-on rather than letting resentment build. `;
    }

    if (profile.independenceValue >= 7) {
        style += `Independence is crucial to you—you need space to pursue your own interests and maintain your individual identity while in a relationship. `;
    } else if (profile.independenceValue <= 3) {
        style += `You thrive on closeness and togetherness, enjoying building shared experiences and interdependence with your partner. `;
    } else {
        style += `You balance togetherness with independence, valuing both connection and personal space. `;
    }

    style += `You show love primarily through ${resp.loveLangs.slice(0, 2).join(' and ').toLowerCase()}, and you likely need to receive love in similar ways to feel truly seen and appreciated.`;

    return style;
}

function generateWhyMatches(resp, profile) {
    const traits = profile.soulmateTraits;
    let reason = `This personality type matches you because they naturally complement your strengths and help you grow in areas where you might face challenges. `;

    if (profile.stressPattern.type === 'introverted' && profile.independenceValue <= 3) {
        reason += `While you may be reserved or private, your ideal partner is patient and creates safe spaces for vulnerability, knowing that your quiet nature masks deep feeling. `;
    }

    if (profile.primaryValues.includes('Communication') && profile.conflictStyle === 'peacekeeping') {
        reason += `You value communication but tend to avoid conflict—your soulmate helps bridge this gap by gently encouraging honest dialogue while honoring your need for harmony. `;
    }

    reason += `They don't just accept your ${resp.cannotTolerate.toLowerCase()}, they actively avoid it because they understand it\'s a core boundary for you. `;

    reason += `Most importantly, this partner embodies the qualities you admire—${resp.admiredQuality.toLowerCase()}—making you feel consistently valued and understood. Together, you create a relationship built on mutual respect, complementary strengths, and shared commitment to growth.`;

    return reason;
}

function displayProfile(profile) {
    // Hide quiz, show results
    quizSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');

    // Populate results
    document.getElementById('personalitySummary').textContent = profile.personalitySummary;
    document.getElementById('relationshipStyle').textContent = profile.relationshipStyle;

    // Soulmate profile
    const traits = profile.soulmateTraits;
    document.getElementById('soulmatePesonalityTraits').textContent = `Your ideal partner is ${traits.traits.join(', and someone who is ')}. They bring authenticity and depth to the relationship, someone you can genuinely be yourself around.`;

    document.getElementById('emotionalQualities').textContent = traits.emotionalQualities.join(', and ') + '. These emotional qualities create a safe, nurturing environment where both of you can be vulnerable.';

    document.getElementById('communicationStyle').textContent = traits.communicationStyle.join(', and ') + '. They understand that good communication isn\'t about never disagreeing—it\'s about being able to navigate differences with respect and care.';

    document.getElementById('sharedValues').textContent = traits.sharedValues.join(', and ') + '. These shared values form the foundation of a partnership that feels meaningful and purpose-driven.';

    document.getElementById('support').textContent = traits.support.join(', and ') + '. When you need them most, they know how to show up for you in ways that actually resonate.';

    document.getElementById('whyMatches').textContent = profile.whyMatches;

    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Progress bar update on form change
quizForm.addEventListener('change', () => {
    const totalInputs = quizForm.querySelectorAll('input[required], textarea[required], select[required]').length;
    const filledInputs = Array.from(quizForm.querySelectorAll('input[required], textarea[required], select[required]')).filter(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            return input.checked;
        }
        return input.value;
    }).length;

    const progress = (filledInputs / totalInputs) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('questionCounter').textContent = `Question ${Math.ceil(filledInputs / 2)} of 10`;
});