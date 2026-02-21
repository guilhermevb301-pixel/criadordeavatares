const sections = [
  { emoji: '👤', title: 'Perfil', description: 'Gerencie suas informações pessoais e foto de perfil' },
  { emoji: '🎨', title: 'Preferências', description: 'Personalize a interface, idioma e notificações' },
  { emoji: '💳', title: 'Plano', description: 'Visualize seu plano atual e gerencie assinatura' },
];

const SettingsPage = () => {
  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-foreground md:text-3xl">
          ⚙️ Configurações
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas preferências e conta
        </p>
      </div>

      <div className="grid gap-4 max-w-2xl">
        {sections.map((section) => (
          <div
            key={section.title}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-card"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-xl">
              {section.emoji}
            </div>
            <div>
              <h3 className="text-base font-semibold font-display text-card-foreground">
                {section.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">{section.description}</p>
              <span className="mt-2 inline-block text-xs text-muted-foreground/60">🔜 Em breve</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
